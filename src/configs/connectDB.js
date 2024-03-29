import mysql from 'mysql2/promise';
require('dotenv').config();

// create the connection to database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  connectionLimit: 10,
});

export default pool;