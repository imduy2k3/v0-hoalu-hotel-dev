const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFile = path.join(__dirname, 'create-users-table.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

console.log('📄 SQL Migration Content:');
console.log(sqlContent);
console.log('\n✅ Migration script ready to run');
console.log('💡 To apply this migration, run the SQL commands in your PostgreSQL database');
