import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Log SQL queries if enabled
pool.on('connect', () => {
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Database connected');
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on database client', err);
    process.exit(-1);
});

export default pool;
