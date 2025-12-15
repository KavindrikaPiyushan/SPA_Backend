import mysql from 'mysql2';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  multipleStatements: true
});

export default db;
