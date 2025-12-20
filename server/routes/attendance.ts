import { RequestHandler } from "express";
import { saveAttendance, getAttendance, deleteAttendance } from "../db";

export const handleSaveAttendance: RequestHandler = async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({
        error: "Database service unavailable",
        details: "DATABASE_URL environment variable is not configured. Please configure it in your Netlify environment variables.",
      });
    }

    const { userEmail, date, classId, subject, timeSlot, room, status } =
      req.body;

    if (!userEmail || !date || !classId || !status) {
      return res.status(400).json({
        error: "Missing required fields: userEmail, date, classId, status",
      });
    }

    const result = await saveAttendance(
      userEmail,
      date,
      classId,
      subject,
      timeSlot,
      room,
      status,
    );
    res.json({
      success: true,
      message: "Attendance saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Save attendance error:", error);
    res.status(500).json({
      error: "Failed to save attendance",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetAttendance: RequestHandler = async (req, res) => {
  try {
    const { userEmail, date } = req.query;

    if (!userEmail || typeof userEmail !== "string") {
      return res.status(400).json({
        error: "Missing required parameter: userEmail",
      });
    }

    if (!process.env.DATABASE_URL) {
      // Return empty data when database is not configured
      return res.json({
        success: true,
        data: { rows: [] },
      });
    }

    const result = await getAttendance(
      userEmail,
      date && typeof date === "string" ? date : undefined,
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      error: "Failed to retrieve attendance",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteAttendance: RequestHandler = async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({
        error: "Database service unavailable",
        details: "DATABASE_URL environment variable is not configured.",
      });
    }

    const { userEmail, date, classId } = req.body;

    if (!userEmail || !date || !classId) {
      return res.status(400).json({
        error: "Missing required fields: userEmail, date, classId",
      });
    }

    const result = await deleteAttendance(userEmail, date, classId);
    res.json({
      success: true,
      message: "Attendance deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete attendance error:", error);
    res.status(500).json({
      error: "Failed to delete attendance",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetSubjectWiseAttendance: RequestHandler = async (
  req,
  res,
) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail || typeof userEmail !== "string") {
      return res.status(400).json({
        error: "Missing required parameter: userEmail",
      });
    }

    const result = await getAttendance(userEmail);
    const records = result.rows as Array<{
      subject: string;
      status: string;
    }>;

    // Calculate subject-wise attendance statistics
    const subjectStats: Record<
      string,
      { total: number; present: number; percentage: number }
    > = {};

    for (const record of records) {
      const subject = record.subject || "Unknown";
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, present: 0, percentage: 0 };
      }
      subjectStats[subject].total += 1;
      if (record.status === "present") {
        subjectStats[subject].present += 1;
      }
    }

    // Calculate percentages
    const subjectAttendance = Object.entries(subjectStats)
      .map(([subject, stats]) => ({
        subject,
        percentage:
          stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
        total: stats.total,
        present: stats.present,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    res.json({
      success: true,
      data: subjectAttendance,
    });
  } catch (error) {
    console.error("Get subject-wise attendance error:", error);
    res.status(500).json({
      error: "Failed to retrieve subject-wise attendance",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
