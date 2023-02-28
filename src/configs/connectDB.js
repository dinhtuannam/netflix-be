import mysql from 'mysql2/promise';

// create the connection to database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'netflix'
});

export default pool;