const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'sdwa_georgia.db');
console.log('Database path:', dbPath);

try {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });

  // Test query
  const count = db.prepare('SELECT COUNT(*) as count FROM SDWA_PUB_WATER_SYSTEMS').get();
  console.log('Total water systems:', count.count);

  // Get sample data
  const systems = db.prepare('SELECT PWSID, PWS_NAME FROM SDWA_PUB_WATER_SYSTEMS LIMIT 5').all();
  console.log('Sample systems:', systems);

  db.close();
  console.log('Database connection successful!');
} catch (error) {
  console.error('Database error:', error);
}
