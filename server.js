const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const redis = require('./redis');
const { promisify } = require('util');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const getAsync = promisify(redis.get).bind(redis);
const smembersAsync = promisify(redis.smembers).bind(redis);
const saddAsync = promisify(redis.sadd).bind(redis);
const sremAsync = promisify(redis.srem).bind(redis);

module.exports = app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  /**
   * create task
   *
   * request parameter
   * task, Array of refTask
   */

  server.post('/todo', (req, res) => {
    redis.incr('id', (err, result) => {
      const key = result;
      Object.assign(req.body, {
        id: result,
        createdAt: new Date(),
        isCompleted: false
      });
      const value = JSON.stringify(req.body);
      redis.set(key, value, async (err, data) => {
        if (err) throw err;
        // redis.expire(key, 10);
        if (req.body.refTask.length !== 0) {
          await Promise.all(
            req.body.refTask.map(
              async refTask => await saddAsync(`childTask:${refTask}`, key)
            )
          );
          return res.json(JSON.parse(value));
        } else {
          return res.json(JSON.parse(value));
        }
      });
    });
  });

  /**
   * fetch all task data
   *
   * no need request parameter
   *
   */
  server.get('/todo', (req, res) => {
    redis.keys('*', async (err, keys) => {
      if (err) throw err;
      if (!keys)
        return res.status(500).send({ err: 'There is no matching data' });
      const values = await Promise.all(
        keys
          .map(key => {
            if (!isNaN(key * 1)) {
              return getAsync(key);
            }
          })
          .filter(e => e !== undefined)
      );
      res.send(values.map(e => JSON.parse(e)));
    });
  });

  /**
   * fetch specific given ID task data
   *
   * request parameter
   * id
   */
  server.get('/todo/:id', (req, res) => {
    const key = req.params.id;
    redis.get(key, (err, result) => {
      if (err) throw err;
      if (!result)
        return res.status(500).send({ err: 'There is no matching data' });
      const value = JSON.parse(result);
      res.json(value);
    });
  });

  /**
   * update specific given ID task data
   *
   * request parameter
   * json of value
   */

  server.post('/todo/:id', async (req, res) => {
    const key = req.params.id;
    const { isCompleted, refTask } = req.body;
    const prevTask = await getAsync(key);
    const prevRefTask = JSON.parse(prevTask).refTask;
    const removedRefTask = prevRefTask.filter(e => refTask.indexOf(e) === -1);

    if (isCompleted) {
      const childRefKeys = await smembersAsync(`childTask:${key}`);
      const values = await Promise.all(
        childRefKeys.map(key => {
          return getAsync(key);
        })
      );
      const undoChild = values
        .map(e => JSON.parse(e))
        .filter(e => !e.isCompleted);
      if (undoChild.length !== 0) {
        return res.status(422).send({
          error: 'This task refers incompleted task',
          refTask: undoChild
        });
      }
    }

    Object.assign(req.body, {
      modifiedAt: new Date()
    });
    const value = JSON.stringify(req.body);
    redis.set(key, value, async (error, data) => {
      if (error) throw error;
      if (!data)
        return res.status(500).send({ error: 'There is no matching data' });
      await Promise.all(
        removedRefTask.map(
          async refTask => await sremAsync(`childTask:${refTask}`, key)
        )
      );
      await Promise.all(
        refTask.map(
          async refTask => await saddAsync(`childTask:${refTask}`, key)
        )
      );
      return res.json(JSON.parse(value));
    });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });
});
