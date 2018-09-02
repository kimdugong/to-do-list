const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const redis = require('./redis');
const { promisify } = require('util');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const getAsync = promisify(redis.get).bind(redis);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  // server.get('/a', (req, res) => {
  //   return app.render(req, res, '/b', req.query)
  // })

  // server.get('/b', (req, res) => {
  //   return app.render(req, res, '/a', req.query)
  // })

  // server.get('/posts/:id', (req, res) => {
  //   return app.render(req, res, '/posts', { id: req.params.id })
  // })

  /**
   * create todo's
   * request parameter
   * task, childTask
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
      redis.set(key, value, (err, data) => {
        if (err) throw err;
        // redis.expire(key, 10);
        res.json(JSON.parse(value));
      });
    });
  });

  /**
   * fetch all task data
   */
  server.get('/todo', (req, res) => {
    redis.keys('*', async (err, keys) => {
      if (err) throw err;
      if (!keys)
        return res.status(500).send({ err: 'There is no matching data' });
      const values = await Promise.all(
        keys
          .map(key => {
            if (key !== 'id') {
              return getAsync(key);
            }
          })
          .filter(e => e !== undefined)
      );
      res.send(values.map(e => JSON.parse(e)));
    });
  });

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
   * update task data
   */

  server.post('/todo/:id', async (req, res) => {
    const key = req.params.id;
    const { isCompleted, childTask } = req.body;
    if (isCompleted) {
      const values = await Promise.all(
        childTask.map(key => {
          return getAsync(key);
        })
      );
      const undoChild = values
        .map(e => JSON.parse(e))
        .filter(e => !e.isCompleted);
      if (undoChild.length !== 0) {
        return res.status(422).send({
          error: 'This task refers incompleted task',
          childTask: undoChild
        });
      }
    }
    Object.assign(req.body, {
      modifiedAt: new Date()
    });
    const value = JSON.stringify(req.body);
    redis.set(key, value, (error, data) => {
      if (error) throw error;
      if (!data)
        return res.status(500).send({ error: 'There is no matching data' });
      res.json(JSON.parse(value));
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
