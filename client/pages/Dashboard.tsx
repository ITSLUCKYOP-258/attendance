import { useState, useMemo, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Calendar,
  TrendingUp,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Class {
  id: string;
  subject: string;
  time: string;
  room: string;
  attendance?: "present" | "absent" | null;
}

interface DayData {
  date: Date;
  isHoliday: boolean;
  classes: Class[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Timetable data based on the provided schedule (MON-SAT)
const TIMETABLE_BY_DAY: Record<number, Class[]> = {
  1: [
    // Monday
    { id: "1", subject: "IKS", time: "10:30-11:20", room: "Classroom" },
    { id: "2", subject: "BEE", time: "11:20-12:10", room: "Classroom" },
    { id: "3", subject: "LPCC", time: "12:10-01:00", room: "Classroom" },
    { id: "4", subject: "FC", time: "01:50-02:40", room: "Classroom" },
    { id: "5", subject: "EM-I", time: "02:40-03:30", room: "Classroom" },
    { id: "6", subject: "ES", time: "03:30-04:20", room: "Classroom" },
    {
      id: "7",
      subject: "Value Education",
      time: "04:20-05:10",
      room: "Classroom",
    },
  ],
  2: [
    // Tuesday
    {
      id: "8",
      subject: "BEE LAB / LPCC LAB",
      time: "10:30-12:10",
      room: "Lab",
    },
    { id: "9", subject: "PCS", time: "12:10-01:00", room: "Classroom" },
    { id: "10", subject: "FC", time: "01:50-02:40", room: "Classroom" },
    { id: "11", subject: "ES", time: "02:40-03:30", room: "Classroom" },
    { id: "12", subject: "IKS", time: "03:30-04:20", room: "Classroom" },
    { id: "13", subject: "Library", time: "04:20-05:10", room: "Library" },
  ],
  3: [
    // Wednesday
    { id: "14", subject: "FC", time: "10:30-11:20", room: "Classroom" },
    { id: "15", subject: "BEE", time: "11:20-12:10", room: "Classroom" },
    { id: "16", subject: "EM-I", time: "12:10-01:00", room: "Classroom" },
    { id: "17", subject: "LPCC", time: "01:50-02:40", room: "Classroom" },
    { id: "18", subject: "PCS", time: "02:40-03:30", room: "Classroom" },
    { id: "19", subject: "EM-I", time: "03:30-04:20", room: "Classroom" },
    { id: "20", subject: "ES", time: "04:20-05:10", room: "Classroom" },
  ],
  4: [
    // Thursday
    { id: "21", subject: "ES", time: "10:30-11:20", room: "Classroom" },
    { id: "22", subject: "BEE", time: "11:20-12:10", room: "Classroom" },
    { id: "23", subject: "PCS", time: "12:10-01:00", room: "Classroom" },
    { id: "24", subject: "EM-I", time: "01:50-02:40", room: "Classroom" },
    { id: "25", subject: "LPCC", time: "02:40-03:30", room: "Classroom" },
    { id: "26", subject: "ES", time: "03:30-04:20", room: "Classroom" },
    { id: "27", subject: "Library", time: "04:20-05:10", room: "Library" },
  ],
  5: [
    // Friday
    { id: "28", subject: "IKS", time: "10:30-11:20", room: "Classroom" },
    { id: "29", subject: "BEE", time: "11:20-12:10", room: "Classroom" },
    { id: "30", subject: "FC", time: "12:10-01:00", room: "Classroom" },
    {
      id: "31",
      subject: "LPCC LAB / BEE LAB",
      time: "01:50-03:30",
      room: "Lab",
    },
    { id: "32", subject: "LPCC", time: "03:30-04:20", room: "Classroom" },
    {
      id: "33",
      subject: "Value Education",
      time: "04:20-05:10",
      room: "Classroom",
    },
  ],
  6: [
    // Saturday
    { id: "34", subject: "EM-I", time: "10:30-11:20", room: "Classroom" },
    { id: "35", subject: "BEE", time: "11:20-12:10", room: "Classroom" },
    { id: "36", subject: "LPCC", time: "12:10-01:00", room: "Classroom" },
    { id: "37", subject: "FC", time: "01:50-02:40", room: "Classroom" },
    {
      id: "38",
      subject: "Club Activities",
      time: "02:40-05:10",
      room: "Various",
    },
  ],
};

export default function Dashboard() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [userId] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).email : "guest";
    } catch {
      return "guest";
    }
  });

  const [attendance, setAttendance] = useState<
    Record<string, Record<string, "present" | "absent">>
  >(() => {
    try {
      const storageKey = `attendanceData_${userId}`;
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const loadAttendanceFromDatabase = async () => {
      try {
        const response = await fetch(`/api/attendance/get?userEmail=${userId}`);
        if (response.ok) {
          const result = await response.json();
          const rows = result.data?.rows || result.rows || [];
          if (rows && rows.length > 0) {
            const attendanceData: Record<
              string,
              Record<string, "present" | "absent">
            > = {};
            rows.forEach(
              (row: { date: string; class_id: string; status: string }) => {
                if (!attendanceData[row.date]) {
                  attendanceData[row.date] = {};
                }
                attendanceData[row.date][row.class_id] = row.status as
                  | "present"
                  | "absent";
              },
            );
            // Merge with existing localStorage data instead of replacing
            setAttendance((prev) => ({ ...prev, ...attendanceData }));
          }
        }
      } catch (error) {
        console.error("Failed to load attendance from database:", error);
        // Data will remain from localStorage if database fails
      }
    };

    loadAttendanceFromDatabase();
  }, [userId]);

  useEffect(() => {
    try {
      const storageKey = `attendanceData_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(attendance));
    } catch {
      console.error("Failed to save attendance data");
    }
  }, [attendance, userId]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const generateCalendarDays = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }

    return calendarDays;
  };

  const dateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const isHoliday = holidays.has(dateKey(selectedDate));

  const calendarDays = generateCalendarDays(currentDate);

  // Get classes for selected date based on day of week
  const getClassesForDate = (date: Date): Class[] => {
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    // Sunday (0) has no classes, so return empty
    if (dayOfWeek === 0) return [];
    return TIMETABLE_BY_DAY[dayOfWeek] || [];
  };

  const selectedDateKey = dateKey(selectedDate);
  const mockClasses = getClassesForDate(selectedDate);
  const classesForDate = mockClasses; // Always show the classes for this day of week

  const attendanceStats = useMemo(() => {
    let present = 0,
      absent = 0,
      total = 0;
    Object.values(attendance).forEach((dateAttendance) => {
      Object.values(dateAttendance).forEach((status) => {
        if (status === "present") present++;
        if (status === "absent") absent++;
        total++;
      });
    });
    return {
      present,
      absent,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [attendance]);

  const filteredAttendanceStats = useMemo(() => {
    if (!filterStartDate || !filterEndDate) {
      return null;
    }

    const startDate = new Date(filterStartDate);
    const endDate = new Date(filterEndDate);

    let present = 0,
      absent = 0,
      total = 0;

    Object.entries(attendance).forEach(([dateStr, dateAttendance]) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const recordDate = new Date(year, month - 1, day);

      if (recordDate >= startDate && recordDate <= endDate) {
        Object.values(dateAttendance).forEach((status) => {
          if (status === "present") present++;
          if (status === "absent") absent++;
          total++;
        });
      }
    });

    return {
      present,
      absent,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [attendance, filterStartDate, filterEndDate]);

  const handleAttendanceChange = async (
    classId: string,
    status: "present" | "absent",
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedDateKey]: {
        ...(prev[selectedDateKey] || {}),
        [classId]: status,
      },
    }));

    const selectedClass = mockClasses.find((c) => c.id === classId);
    if (selectedClass) {
      try {
        await fetch("/api/attendance/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: userId,
            date: selectedDateKey,
            classId,
            subject: selectedClass.subject,
            timeSlot: selectedClass.time,
            room: selectedClass.room,
            status,
          }),
        });
      } catch (error) {
        console.error("Failed to save attendance:", error);
      }
    }
  };

  const handleMarkFullDay = async (status: "present" | "absent") => {
    const newDateAttendance: Record<string, "present" | "absent"> = {};
    mockClasses.forEach((c) => {
      newDateAttendance[c.id] = status;
    });
    setAttendance((prev) => ({
      ...prev,
      [selectedDateKey]: newDateAttendance,
    }));

    // Save all classes for this day to database
    for (const classData of mockClasses) {
      try {
        await fetch("/api/attendance/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: userId,
            date: selectedDateKey,
            classId: classData.id,
            subject: classData.subject,
            timeSlot: classData.time,
            room: classData.room,
            status,
          }),
        });
      } catch (error) {
        console.error("Failed to save attendance:", error);
      }
    }
  };

  // Show classes only if it's a weekday with scheduled classes and not a holiday
  const shouldShowClasses = mockClasses.length > 0 && !isHoliday;

  const handleToggleHoliday = () => {
    const newHolidays = new Set(holidays);
    if (newHolidays.has(selectedDateKey)) {
      newHolidays.delete(selectedDateKey);
    } else {
      newHolidays.add(selectedDateKey);
    }
    setHolidays(newHolidays);
  };

  const handleUnmark = async () => {
    const attendanceForDay = attendance[selectedDateKey];
    if (attendanceForDay) {
      for (const classId of Object.keys(attendanceForDay)) {
        try {
          await fetch("/api/attendance/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: userId,
              date: selectedDateKey,
              classId,
            }),
          });
        } catch (error) {
          console.error("Failed to delete attendance:", error);
        }
      }
    }

    setAttendance((prev) => {
      const newAttendance = { ...prev };
      delete newAttendance[selectedDateKey];
      return newAttendance;
    });
  };

  const handleClearAllData = async () => {
    try {
      // Clear from database for all dates
      for (const [dateKey, dateAttendance] of Object.entries(attendance)) {
        for (const classId of Object.keys(dateAttendance)) {
          try {
            await fetch("/api/attendance/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userEmail: userId,
                date: dateKey,
                classId,
              }),
            });
          } catch (error) {
            console.error("Failed to delete attendance:", error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to clear data:", error);
    }

    // Clear from localStorage and state
    const storageKey = `attendanceData_${userId}`;
    localStorage.removeItem(storageKey);
    setAttendance({});
  };

  const isFullyAbsent = (date: Date): boolean => {
    const dKey = dateKey(date);
    const dayAttendance = attendance[dKey];
    if (!dayAttendance || Object.keys(dayAttendance).length === 0) {
      return false;
    }
    // Check if all classes are marked as absent
    return Object.values(dayAttendance).every((status) => status === "absent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Attendance Dashboard
              </h1>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Clear All Attendance Data?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your entered attendance
                    data. This action cannot be undone. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Track and manage your class attendance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {attendanceStats.percentage}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Overall Attendance
                    </p>
                    {attendanceStats.percentage < 75 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-error">
                        <AlertCircle className="w-4 h-4" />
                        Below threshold
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">
                      {attendanceStats.present}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Classes Attended
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-error mb-1">
                      {attendanceStats.absent}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Classes Missed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar */}
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {MONTHS[currentDate.getMonth()]}{" "}
                      {currentDate.getFullYear()}
                    </CardTitle>
                    <CardDescription>
                      Select a date to view and mark attendance
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 py-2"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((date, i) => {
                    if (date === null) {
                      return (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                      );
                    }

                    const dKey = dateKey(date);
                    const isSelected = isSameDay(selectedDate, date);
                    const hasAttendance = !!attendance[dKey];
                    const isHolidayDate = holidays.has(dKey);
                    const dayClasses = getClassesForDate(date);
                    const hasClasses = dayClasses.length > 0;
                    const fullyAbsent = isFullyAbsent(date);

                    return (
                      <button
                        key={`${date.getTime()}`}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm transition-all ${
                          isSelected
                            ? "bg-primary text-white ring-2 ring-primary/50"
                            : fullyAbsent
                              ? "bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
                              : isHolidayDate
                                ? "bg-warning/20 text-warning-foreground border border-warning/30 hover:bg-warning/30"
                                : hasAttendance
                                  ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                                  : hasClasses
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Details & Actions */}
          <div className="space-y-6">
            {/* Selected Date Details */}
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isHoliday ? (
                  <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-warning-foreground">
                      This is a holiday
                    </p>
                  </div>
                ) : classesForDate.length > 0 ? (
                  <div className="space-y-3">
                    {mockClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-2"
                      >
                        <p className="font-medium text-slate-900 dark:text-white">
                          {cls.subject}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {cls.time} • {cls.room}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleAttendanceChange(cls.id, "present")
                            }
                            className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                              attendance[selectedDateKey]?.[cls.id] ===
                              "present"
                                ? "bg-success text-white"
                                : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-success/20"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleAttendanceChange(cls.id, "absent")
                            }
                            className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                              attendance[selectedDateKey]?.[cls.id] === "absent"
                                ? "bg-error text-white"
                                : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-error/20"
                            }`}
                          >
                            <X className="w-4 h-4" />
                            Absent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
                    No classes scheduled
                  </p>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  {!isHoliday && classesForDate.length > 0 && (
                    <>
                      <Button
                        onClick={() => handleMarkFullDay("present")}
                        variant="outline"
                        className="w-full text-success border-success hover:bg-success/10"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark Full Day Present
                      </Button>
                      <Button
                        onClick={() => handleMarkFullDay("absent")}
                        variant="outline"
                        className="w-full text-error border-error hover:bg-error/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Mark Full Day Absent
                      </Button>
                    </>
                  )}

                  {!!attendance[selectedDateKey] && (
                    <Button
                      onClick={handleUnmark}
                      variant="outline"
                      className="w-full text-slate-600 dark:text-slate-400"
                    >
                      Unmark Attendance
                    </Button>
                  )}

                  <Button
                    onClick={handleToggleHoliday}
                    variant={isHoliday ? "default" : "outline"}
                    className={`w-full ${
                      isHoliday
                        ? "bg-warning text-warning-foreground hover:bg-warning/90"
                        : ""
                    }`}
                  >
                    {isHoliday ? "Remove Holiday" : "Set as Holiday"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress to Target */}
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Attendance Target
                </CardTitle>
                <CardDescription>
                  Current: {attendanceStats.percentage}% (Target: 75%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Progress
                    value={Math.min(attendanceStats.percentage, 100)}
                    className="h-2"
                  />
                </div>

                {attendanceStats.percentage < 75 && (
                  <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                    <p className="text-xs text-error-foreground font-medium">
                      ⚠️ Attend{" "}
                      {Math.ceil((75 - attendanceStats.percentage) / 10)} more
                      classes to reach 75%
                    </p>
                  </div>
                )}

                {attendanceStats.percentage >= 75 && (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                    <p className="text-xs text-success font-medium">
                      ✓ You're meeting the attendance target
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
