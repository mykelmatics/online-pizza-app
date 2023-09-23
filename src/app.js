import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';
import Model from './models/model';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', indexRouter);
app.get('/', async (req, res) => {
  try {
    console.log('started uering');
    const model = new Model();
    const pizzas = await model.select('*');
    console.log('end', pizzas);
    return res.send(pizzas);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});
app.use((err, req, res, next) => {
  console.log(res.status, Object.keys(res) ,'hhghh');
  res.status(400).json({ error: err.stack });
  next();
});

export default app;
