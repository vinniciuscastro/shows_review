import { createTables, dropTables } from './schema.js';
import { seedDatabase } from './seed.js';
import pool from '../config/database.js';

/**
 * Main setup function
 */
async function setup() {
    try {
        console.log('=================================');
        console.log('Database Setup Started');
        console.log('=================================\n');

        // Create tables
        await createTables();

        console.log('\n=================================');
        console.log('Seeding Database');
        console.log('=================================\n');

        // Seed database
        await seedDatabase();

        console.log('\n=================================');
        console.log('Setup Complete!');
        console.log('=================================\n');

        // Close the pool
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        await pool.end();
        process.exit(1);
    }
}

/**
 * Reset database (drop and recreate)
 */
async function reset() {
    try {
        console.log('=================================');
        console.log('Database Reset Started');
        console.log('=================================\n');

        // Drop all tables
        await dropTables();

        console.log('\n=================================');
        console.log('Creating Tables');
        console.log('=================================\n');

        // Create tables
        await createTables();

        console.log('\n=================================');
        console.log('Seeding Database');
        console.log('=================================\n');

        // Seed database
        await seedDatabase();

        console.log('\n=================================');
        console.log('Reset Complete!');
        console.log('=================================\n');

        // Close the pool
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Reset failed:', error);
        await pool.end();
        process.exit(1);
    }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'reset') {
    reset();
} else {
    setup();
}
