/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User types for the Attendance Management System
 */
export type UserRole = "student" | "admin" | "teacher";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  userId: string;
  rollNumber: string;
  branch: string;
  semester: number;
  phoneNumber?: string;
}

/**
 * Class and Timetable types
 */
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface ClassSession {
  id: string;
  subject: Subject;
  startTime: string;
  endTime: string;
  room: string;
  dayOfWeek: number; // 0-6, Sunday-Saturday
  instructor?: string;
}

export interface Timetable {
  id: string;
  branch: string;
  semester: number;
  year: number;
  classes: ClassSession[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attendance types
 */
export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classSessionId: string;
  date: Date;
  status: AttendanceStatus;
  markedBy: string; // admin ID or student ID
  markedAt: Date;
  isHoliday?: boolean;
}

export interface AttendanceStats {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  lastUpdated: Date;
}

/**
 * Holiday management
 */
export interface Holiday {
  id: string;
  date: Date;
  name: string;
  description?: string;
  createdAt: Date;
}

/**
 * System settings
 */
export interface SystemSettings {
  id: string;
  minAttendanceThreshold: number;
  attendanceLockDays: number;
  academicYearStart: Date;
  academicYearEnd: Date;
  updatedAt: Date;
}
