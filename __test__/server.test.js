const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
const url = 'http://localhost:3000';
// const server = require('../server');

describe('Test suit', function() {
  // this.timeout(10000);
  // let httpServer;

  // before(async () => {
  //   httpServer = await server;
  // });

  it('should list ALL list on /todo GET', done => {
    chai
      .request(url)
      .get('/todo')
      .end(function(err, res) {
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // it('serves the Next.js app', async () => {
  //   const res = await fetch(`http://localhost:${httpServer.address().port}`);
  //   expect(await res.text()).toBe('Welcome to Next.js!');
  // });

  // after(() => httpServer.close());
});
