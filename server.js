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
const setAsync = promisify(redis.set).bind(redis);
const smembersAsync = promisify(redis.smembers).bind(redis);
const saddAsync = promisify(redis.sadd).bind(redis);
const sremAsync = promisify(redis.srem).bind(redis);
const incrAsync = promisify(redis.incr).bind(redis);
const getAllKeys = promisify(redis.keys).bind(redis);

module.exports = app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  /**
   * create task
   *
   * request parameter
   * task, Array of refTask
   */

  server.post('/todo', async (req, res) => {
    try {
      if (!req.body.task || !Array.isArray(req.body.refTask)) {
        return res.status(503).send({ err: 'Data is not appropriate' });
      }
      const key = await incrAsync('id');

      Object.assign(req.body, {
        id: key,
        createdAt: new Date(),
        isCompleted: false
      });

      const task = JSON.stringify(req.body);
      await setAsync(key, task);
      // redis.expire(key, 10);
      await Promise.all(
        req.body.refTask.map(
          async refTask => await saddAsync(`childTask:${refTask}`, key)
        )
      );
      return res.json(JSON.parse(task));
    } catch (err) {
      console.log('create task error  : ', err);
      return res.status(503).send({ err });
    }
  });

  /**
   * fetch all task data
   *
   * no need request parameter
   *
   */
  server.get('/todo', async (req, res) => {
    try {
      const keys = await getAllKeys('*');
      if (keys.length === 0) {
        return res.status(503).send({ err: 'There is no keys' });
      }
      const tasks = await Promise.all(
        keys
          .map(key => {
            if (!isNaN(key * 1)) {
              return getAsync(key);
            }
          })
          .filter(e => e !== undefined)
      );
      return res.send(tasks.map(task => JSON.parse(task)));
    } catch (err) {
      return res.status(503).send({ err });
    }
  });

  /**
   * fetch specific given ID task data
   *
   * request parameter
   * id
   */
  server.get('/todo/:id', async (req, res) => {
    try {
      const key = req.params.id;
      const task = await getAsync(key);
      if (!task) {
        return res.status(500).send({ err: 'There is no matching data' });
      }
      return res.json(JSON.parse(task));
    } catch (err) {
      return res.status(503).send({ err });
    }
  });

  /**
   * update specific given ID task data
   *
   * request parameter
   * json of value
   */

  server.post('/todo/:id', async (req, res) => {
    try {
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

      const task = JSON.stringify(req.body);

      await setAsync(key, task);
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
      return res.json(JSON.parse(task));
    } catch (err) {
      return res.status(503).send({ err });
    }
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });
});
