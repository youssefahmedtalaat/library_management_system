import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'library_lms_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_key_library_lms_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  ai: {
    enabled: process.env.AI_ENABLED !== 'false',
    provider: process.env.AI_PROVIDER || 'gemini',
    model: process.env.AI_MODEL || 'gemini-1.5-flash',
    apiKey: process.env.AI_API_KEY || '',
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '12000', 10),
    maxInputChars: parseInt(process.env.AI_MAX_INPUT_CHARS || '2000', 10)
  }
};
