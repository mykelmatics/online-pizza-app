export const createPizzaTable = `
DROP TABLE IF EXISTS pizza;
CREATE TABLE IF NOT EXISTS pizza (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  toppings VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  is_available BOOLEAN NOT NULL
  )
  `;
