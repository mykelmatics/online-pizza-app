import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { server } from '../src/bin/www';
import Model from '../src/models/model';
import app from '../src/app';

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
const clause = ` WHERE id = ${1} `;

const columns = 'name, description, price, toppings, category, is_available';
describe('Online Pizza App', () => {
  it('should return all pizza on GET /pizzas', (done) => {
    dbStub.select.withArgs('*').resolves({ rows: [data] });
    chai
      .request(server)
      .get('/v1/pizzas')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.deep.equal([data]);
        done();
      });
  });
  it('should return create pizza on request /pizza', (done) => {
    dbStub.insertWithReturn.withArgs(columns, values).resolves({ rows: data });
    chai
      .request(app)
      .post('/v1/pizza')
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.deep.equal(data);
        done();
      });
  });
  it('should return a specific pizza on request /pizza/:id', (done) => {
    dbStub.select.withArgs('*', clause).resolves({ rows: data });
    chai
      .request(app)
      .get('/v1/pizza/1')
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.deep.equal(data);
        done();
      });
  });

  it('should delete a specific pizza on request /pizza/:id', (done) => {
    let db = [
      {
        ...data,
        id: 1,
      },
    ];
    dbStub.delete.callsFake((clause) => {
      const pizzaId = clause?.split('=')[1].replace(' ', '');
      console.log(clause, pizzaId);
      if (!pizzaId) return;
      db = db.filter((item) => +item.id !== +pizzaId);
      return;
    });
    dbStub.select.withArgs('*', clause).resolves({ rows: db[0] });

    chai
      .request(app)
      .delete('/v1/pizza/1')
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(db).to.deep.equal([]);
        done();
      });
  });

  it('should update a specific pizza info on request /pizza/:id', (done) => {
    let db = [
      {
        ...data,
        id: 1,
      },
    ];
    dbStub.update.callsFake((values, clause) => {
      const pizzaId = clause?.split('=')[1].replace(' ', '');
      if (!pizzaId) return;
      const findIndex = db.findIndex((item) => +item.id === +pizzaId);
      if (findIndex !== -1) db[findIndex] = { ...db[findIndex], ...values };
      return;
    });
    dbStub.select.withArgs('*', clause).resolves({ rows: db[0] });

    chai
      .request(app)
      .put('/v1/pizza/1')
      .send({ description: 'plantain sauce' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(db[0].description).to.equal('plantain sauce');
        done();
      });
  });
});
