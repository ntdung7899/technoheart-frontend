const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
    
    const client = await pool.connect();
    console.log('✅ Successfully connected to database!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify your credentials in .env file');
    console.error('3. Make sure the database exists');
    console.error('4. Check if the host and port are correct');
    process.exit(1);
  }
}

testConnection();
