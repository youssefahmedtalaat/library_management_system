import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  console.log('🔄 Initializing MySQL database for Smart Library LMS...');

  // Connect to MySQL server without selecting DB first to ensure DB exists
  const serverConn = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    multipleStatements: true
  });

  try {
    await serverConn.query(`
      CREATE DATABASE IF NOT EXISTS \`${env.db.database}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`✅ Database \`${env.db.database}\` verified or created.`);
  } finally {
    await serverConn.end();
  }

  // Connect to the specific database
  const dbConn = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    database: env.db.database,
    multipleStatements: true
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('⏳ Running schema.sql...');
    await dbConn.query(schemaSql);
    console.log('✅ Schema tables, constraints, and indexes created.');

    try {
      await dbConn.query('ALTER TABLE books ADD COLUMN ratings_count INT NOT NULL DEFAULT 0 AFTER rating');
    } catch {
      // Column already exists, ignore
    }

    const seedsSql = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf-8');
    console.log('⏳ Running seeds.sql...');
    await dbConn.query(seedsSql);
    console.log('✅ Seed data inserted successfully.');

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  } finally {
    await dbConn.end();
  }
}

// Run directly if invoked from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
