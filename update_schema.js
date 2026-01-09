import db from './src/config/db.js';

const sql = "ALTER TABLE Service ADD COLUMN media JSON DEFAULT NULL";

db.query(sql, (err, result) => {
  if (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists');
    } else {
      console.error('Error updating schema:', err);
    }
  } else {
    console.log('Schema updated successfully');
  }
  process.exit();
});
