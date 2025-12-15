import fs from 'fs';
import path from 'path';
import db from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initDB() {
  const sql = fs.readFileSync(
    path.join(__dirname, '../database/init.sql'),
    'utf8'
  );

  db.query(sql, err => {
    if (err) {
      console.error('DB init failed:', err);
    } else {
      console.log('Database initialized');
    }
  });
}
