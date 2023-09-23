import { pool } from '../models/pool';
import {
  createPizzaTable,
} from './query';

export const executeQueryArray = async arr => new Promise(resolve => {
  const stop = arr.length;
  arr.forEach(async (q, index) => {
    await pool.query(q);
    if (index + 1 === stop) resolve();
  });
});

export const createTables = () => executeQueryArray([ createPizzaTable ]);
