const redis = require('redis');
const client = redis.createClient();

client.on_connect('error', error => {
  console.log('Redis connect error  : ', error);
});

module.exports = client;
