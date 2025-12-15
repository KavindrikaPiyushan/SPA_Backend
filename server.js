import app from './src/app.js';
import { initDB } from './src/config/initDB.js';

const PORT = process.env.PORT || 3000;

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
