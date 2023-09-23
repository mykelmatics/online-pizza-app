const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { server } = require('../src/bin/www');
const { default: Model } = require('../src/models/model');
const { default: app } = require('../src/app');

// Configure chai to use chai-http plugin
chai.use(chaiHttp);
const { expect } = chai;

let dbStub;

beforeEach(() => {
  // Create a stub for the Db class methods
  dbStub = sinon.stub(Model.prototype);
});

afterEach(() => {
  // Restore the stubs after each test
  sinon.restore();
});

const data = {
  name: 'Meat pizza',
  description: 'pizza with sauce',
  price: 10060,
  toppings: ['hello', 'hi'],
  category: 'meat',
  is_available: false,
};
const values = `'${data.name}', '${data.description}', '${
  data.price
}', '${JSON.stringify(data.toppings)}', '${data.category}', '${
  data.is_available
}'`;
const columns = 'name, description, price, toppings, category, is_available';
describe('Express App', () => {
  it('should return "Hello, World!" on GET /', (done) => {
    dbStub.select.withArgs('*').resolves('Hello, World!');
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello, World!');
        done();
      });
  });
  it('should return create pizza on request /pizza', (done) => {
    dbStub.insertWithReturn.withArgs(columns, values).resolves(data);
    chai
      .request(app)
      .post('/v1/pizza')
      .send(data)
      .end((err, res) => {
        console.log(res.body, "hhh");
        expect(res).to.have.status(200);
        expect(res._body.data).to.equal(data);
        done();
      });
  });
});
