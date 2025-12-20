import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSaveAttendance,
  handleGetAttendance,
  handleDeleteAttendance,
  handleGetSubjectWiseAttendance,
} from "./routes/attendance";
import { initializeDatabase } from "./db";

// Initialize database on startup (non-blocking)
if (process.env.DATABASE_URL) {
  initializeDatabase().catch((error) => {
    console.error("Failed to initialize database:", error);
  });
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Attendance API routes
  app.post("/api/attendance/save", handleSaveAttendance);
  app.get("/api/attendance/get", handleGetAttendance);
  app.post("/api/attendance/delete", handleDeleteAttendance);
  app.get("/api/attendance/subject-wise", handleGetSubjectWiseAttendance);

  return app;
}
