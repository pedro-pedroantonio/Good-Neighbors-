import mysql from 'mysql2/promise';

// Create pool only when needed (lazy loading)
let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    const host = process.env.DB_HOST || 'localhost';
    const useSsl =
      process.env.DB_SSL === 'true' ||
      (process.env.DB_SSL !== 'false' && host.includes('.mysql.database.azure.com'));

    pool = mysql.createPool({
      host,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      port: parseInt(process.env.DB_PORT || '3306'),
      ssl: useSsl ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function query(sql: string, values?: any[]) {
  try {
    const connectionPool = getPool();
    const connection = await connectionPool.getConnection();
    const [results] = await connection.execute(sql, values || []);
    connection.release();
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export default getPool;
