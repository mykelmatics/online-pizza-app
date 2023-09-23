import express from 'express';
import {
  addPizza, deletePizza, getAllPizza, getPizza, updatePizza
} from '../controllers/pizza';
import { validateUserInput } from '../middlewares/middleware';

const indexRouter = express.Router();

indexRouter.post('/pizza', validateUserInput, addPizza);
indexRouter.get('/pizzas', getAllPizza);
indexRouter.get('/pizza/:id', getPizza);
indexRouter.put('/pizza/:id', updatePizza);
indexRouter.delete('/pizza/:id', deletePizza);

export default indexRouter;
