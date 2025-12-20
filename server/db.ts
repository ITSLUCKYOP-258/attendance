import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function query(sql: string, params: any[] = []) {
  try {
    const result = await pool.query(sql, params);
    return { rows: result.rows };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    await neonQuery(`
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

    await neonQuery(`
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

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

export async function saveAttendance(
  userEmail: string,
  date: string,
  classId: string,
  subject: string,
  timeSlot: string,
  room: string,
  status: string,
) {
  return neonQuery(
    `INSERT INTO attendance (user_email, date, class_id, subject, time_slot, room, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_email, date, class_id) DO UPDATE SET status = $7, marked_at = CURRENT_TIMESTAMP
     RETURNING *;`,
    [userEmail, date, classId, subject, timeSlot, room, status],
  );
}

export async function getAttendance(userEmail: string, date?: string) {
  if (date) {
    return neonQuery(
      `SELECT * FROM attendance WHERE user_email = $1 AND date = $2 ORDER BY marked_at DESC;`,
      [userEmail, date],
    );
  }
  return neonQuery(
    `SELECT * FROM attendance WHERE user_email = $1 ORDER BY date DESC;`,
    [userEmail],
  );
}

export async function deleteAttendance(userEmail: string, date: string, classId: string) {
  return neonQuery(
    `DELETE FROM attendance WHERE user_email = $1 AND date = $2 AND class_id = $3;`,
    [userEmail, date, classId],
  );
}

export default { neonQuery, initializeDatabase, saveAttendance, getAttendance, deleteAttendance };
