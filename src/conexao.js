const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'market_cubos',
  password: 'cursoPDZIFOOD',
  port: 5432
});

const query = (text, param) => pool.query(text, param);

module.exports = {
  query
}
