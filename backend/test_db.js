const db = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log('Database connection SUCCESSFUL!', rows);
    process.exit(0);
  } catch (err) {
    console.error('Database connection FAILED:', err.message);
    process.exit(1);
  }
}

testConnection();
