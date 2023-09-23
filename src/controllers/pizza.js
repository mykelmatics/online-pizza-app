import Model from '../models/model';

const pizzaModel = new Model('pizza');

// Get All Pizzas
export const getAllPizza = async (req, res) => {
  try {
    const data = await pizzaModel.select('*');
    res.status(200).json({ data: data.rows });
  } catch (error) {
    res.status(500).json({ messages: error.stack });
  }
};

// Get Pizza by ID
export const getPizza = async (req, res) => {
  const { id } = req.params;
  const clause = ` WHERE id = ${id} `;
  try {
    const pizza = await pizzaModel.select('*', clause);
    if (!pizza) {
      res.status(404).json({ messages: 'Pizza not found' });
    } else {
      res.status(200).json({ data: pizza.rows });
    }
  } catch (error) {
    res.status(500).json({ messages: error.stack });
  }
};

// Add a new Pizza
export const addPizza = async (req, res) => {
  const {
    name, description, price, toppings, category, is_available
  } = req.body;
  const columns = 'name, description, price, toppings, category, is_available';
  // eslint-disable-next-line camelcase
  const values = `'${name}', '${description}', '${price}', '${JSON.stringify(toppings)}', '${category}', '${is_available}'`;
  try {
    const data = await pizzaModel.insertWithReturn(columns, values);
    console.log(data, "hi");
    res.status(200).json({ messages: 'Created Successfully', data: data.rows });
  } catch (err) {
    res.status(400).json({ messages: err.stack });
  }
};

// Update Pizza by ID
export const updatePizza = async (req, res) => {
  const { id } = req.params;
  const clause = ` WHERE id = ${id} `;
  try {
    const pizza = await pizzaModel.select('*', clause);
    if (!pizza) {
      res.status(404).json({ messages: 'Pizza not found' });
    } else {
      const values = {...req.body};
      await pizzaModel.update(values, clause);
      res.status(200).json({ messages: 'Updated Successfully' });
    }
  } catch (err) {
    res.status(400).json({ messages: err.stack });
  }
};

// Delete Pizza by ID
export const deletePizza = async (req, res) => {
  const { id } = req.params;
  const clause = ` WHERE id = ${id} `;
  try {
    const pizza = await pizzaModel.select('*', clause);
    if (!pizza) {
      res.status(404).json({ messages: 'Pizza not found' });
    } else {
      await pizzaModel.delete(clause);
      res
        .status(200)
        .json({ messages: 'Deleted Successfully' });
    }
  } catch (err) {
    res.status(400).json({ messages: err.stack });
  }
};
