import { RequestHandler } from "express";
import { saveAttendance, getAttendance, deleteAttendance } from "../db";

export const handleSaveAttendance: RequestHandler = async (req, res) => {
  try {
    const { userEmail, date, classId, subject, timeSlot, room, status } = req.body;

    if (!userEmail || !date || !classId || !status) {
      return res.status(400).json({
        error: "Missing required fields: userEmail, date, classId, status",
      });
    }

    const result = await saveAttendance(userEmail, date, classId, subject, timeSlot, room, status);
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
