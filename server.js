const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const redis = require('./redis');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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

  server.post('/todo', (req, res) => {
    redis.incr('id', (err, result) => {
      const key = result;
      Object.assign(req.body, { id: result, timestamp: new Date() });
      const value = JSON.stringify(req.body);
      redis.set(key, value, (err, data) => {
        if (err) throw err;
        // redis.expire(key, 10);
        res.json(value);
      });
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

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });
});
