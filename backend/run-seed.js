const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: 'postgresql://school_admin:school_secure_pass_2024@localhost:5432/school_management'
});

async function runSeed() {
    const sql = fs.readFileSync(path.join(__dirname, 'seed-new-auth.sql'), 'utf8');
    try {
        console.log('Running seed script...');
        await pool.query(sql);
        console.log('Seed successful!');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await pool.end();
    }
}

runSeed();
