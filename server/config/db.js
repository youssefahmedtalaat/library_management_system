import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  ...env.db,
  multipleStatements: true,
  dateStrings: true
});

/**
 * Execute a parameterized SQL query
 */
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Execute multiple database operations inside a single ACID transaction
 * Rollback automatically on error and release connection
 */
export async function withTransaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test MySQL connection
 */
export async function checkDbConnection() {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS result');
    return result[0].result === 2;
  } catch (err) {
    console.error('MySQL Connection Error:', err.message);
    return false;
  }
}
