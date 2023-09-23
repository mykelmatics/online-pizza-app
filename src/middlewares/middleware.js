export const validateUserInput = async (req, res, next) => {
  const {
    name, description, price, toppings, category
  } = req.body;
  if (!name || !description || !price || !toppings || !category) {
    return res.status(422).send({ message: 'All fields are required' });
  }
  if (typeof price !== 'number') {
    return res.status(422).send({ message: 'Invalid price format' });
  }
  return next();
};
