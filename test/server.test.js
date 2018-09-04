const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const should = chai.should();
const url = 'http://localhost:3000';

before('SERVER running', () => {
  it('should SERVER is running before test', done => {
    chai
      .request(url)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal({});
        expect(err).to.be.null;
        done();
      });
  });

  it('Making dummy data before Testing', done => {
    chai
      .request(url)
      .post('/todo')
      .send({
        task: `test task data! could be edited`,
        refTask: []
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.id).to.deep.equal(1);
        expect(res.body.refTask).to.be.an('array');
        expect(res.body.task).to.deep.equal('test task data! could be edited');
        expect(err).to.be.null;
        done();
      });
  });
});

describe('Test suit for GET API', () => {
  it('should ALL list on /todo GET', done => {
    chai
      .request(url)
      .get('/todo')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  it('should specific list on /todo/:id GET', done => {
    chai
      .request(url)
      .get('/todo/1')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.id).to.deep.equal(1);
        expect(err).to.be.null;
        done();
      });
  });

  it('should 422 not exist list on /todo/:id GET', done => {
    chai
      .request(url)
      .get('/todo/abcd')
      .end((err, res) => {
        res.should.have.status(500);
        expect(res.body).to.deep.equal({
          err: 'There is no matching data'
        });
        expect(err).to.be.null;
        done();
      });
  });
});

describe('Test suit for POST API', () => {
  it('should SET list on /todo POST', done => {
    chai
      .request(url)
      .post('/todo')
      .send({
        task: 'test task!',
        refTask: [1]
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.refTask).to.be.an('array');
        expect(res.body.task).to.deep.equal('test task!');
        expect(err).to.be.null;
        done();
      });
  });

  it('should UPDATE specific list on /todo/:id POST', done => {
    chai
      .request(url)
      .post('/todo/1')
      .send({
        id: 1,
        task: 'test task! finally edited',
        refTask: [],
        isCompleted: false,
        modifiedAt: new Date(),
        createdAt: new Date()
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.refTask).to.be.an('array');
        expect(res.body.task).to.deep.equal('test task! finally edited');
        expect(res.body.id).to.deep.equal(1);
        expect(err).to.be.null;
        done();
      });
  });

  it('should 422 FAILED update cause child task is not completed on /todo/:id POST', done => {
    chai
      .request(url)
      .post('/todo/1')
      .send({
        id: 1,
        task: 'test task! finally edited',
        refTask: [],
        isCompleted: true,
        modifiedAt: new Date(),
        createdAt: new Date()
      })
      .end((err, res) => {
        res.should.have.status(422);
        expect(res.body.error).to.deep.equal(
          'This task refers incompleted task'
        );
        expect(res.body.refTask[0].isCompleted).to.be.false;
        expect(err).to.be.null;
        done();
      });
  });

  it('should UPDATE isCompleted to true for complete task has child task on /todo/:id POST', done => {
    chai
      .request(url)
      .post('/todo/2')
      .send({
        id: 2,
        task: 'test task!',
        refTask: [1],
        isCompleted: true,
        modifiedAt: new Date(),
        createdAt: new Date()
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.refTask).to.be.an('array');
        expect(res.body.task).to.deep.equal('test task!');
        expect(res.body.id).to.deep.equal(2);
        expect(res.body.isCompleted).to.be.true;
        expect(err).to.be.null;
        done();
      });
  });

  it('should UPDATE isCompleted to true cause all child task is completed on /todo/:id POST', done => {
    chai
      .request(url)
      .post('/todo/1')
      .send({
        id: 1,
        task: 'test task! finally edited',
        refTask: [],
        isCompleted: true,
        modifiedAt: new Date(),
        createdAt: new Date()
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.refTask).to.be.an('array');
        expect(res.body.task).to.deep.equal('test task! finally edited');
        expect(res.body.id).to.deep.equal(1);
        expect(res.body.isCompleted).to.be.true;
        expect(err).to.be.null;
        done();
      });
  });
});
