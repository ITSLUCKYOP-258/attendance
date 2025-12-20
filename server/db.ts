import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function initializeDatabase() {
  try {
    await client.connect();
    console.log("Connected to Neon database");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        class_id VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        time_slot VARCHAR(255),
        room VARCHAR(255),
        status VARCHAR(50),
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, date, class_id)
      );
    `);

    console.log("Database tables initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}

export default client;
