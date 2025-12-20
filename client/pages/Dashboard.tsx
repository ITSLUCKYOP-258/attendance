import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Check, X, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Timetable data based on the provided schedule (MON-SAT)
// Corrected as per the official timetable image
const TIMETABLE_BY_DAY: Record<number, Class[]> = {
  1: [ // Monday
    { id: "1", subject: "IKS", time: "10:30-11:20", room: "AS" },
    { id: "2", subject: "BEE(PM)", time: "11:20-12:10", room: "PM" },
    { id: "3", subject: "LPCC(RM)", time: "12:10-01:00", room: "RM" },
    { id: "4", subject: "FC(GB)", time: "01:50-02:40", room: "GB" },
    { id: "5", subject: "EM-I(DKY)", time: "02:40-03:30", room: "DKY" },
    { id: "6", subject: "ES(RS)", time: "03:30-04:20", room: "RS" },
  ],
  2: [ // Tuesday
    { id: "7", subject: "BEE LAB / LPCC LAB", time: "10:30-11:20", room: "BATCH I/II" },
    { id: "8", subject: "PCS(AS)", time: "11:20-12:10", room: "AS" },
    { id: "9", subject: "FC(GB)", time: "01:50-02:40", room: "GB" },
    { id: "10", subject: "ES(RS)", time: "03:30-04:20", room: "RS" },
    { id: "11", subject: "IKS(AS)", time: "04:20-05:10", room: "AS" },
  ],
  3: [ // Wednesday
    { id: "12", subject: "FC(GB)", time: "10:30-11:20", room: "GB" },
    { id: "13", subject: "BEE(PM)", time: "11:20-12:10", room: "PM" },
    { id: "14", subject: "EM-I(DKY)", time: "12:10-01:00", room: "DKY" },
    { id: "15", subject: "LPCC(RM)", time: "01:50-02:40", room: "RM" },
    { id: "16", subject: "PCS(AS)", time: "02:40-03:30", room: "AS" },
    { id: "17", subject: "EM-I(DKY)", time: "03:30-04:20", room: "DKY" },
    { id: "18", subject: "ES(RS)", time: "04:20-05:10", room: "RS" },
  ],
  4: [ // Thursday
    { id: "19", subject: "ES(RS)", time: "10:30-11:20", room: "RS" },
    { id: "20", subject: "BEE(PM)", time: "11:20-12:10", room: "PM" },
    { id: "21", subject: "PCS(AS)", time: "12:10-01:00", room: "AS" },
    { id: "22", subject: "EM-I(DKY)", time: "01:50-02:40", room: "DKY" },
    { id: "23", subject: "LPCC(RM)", time: "02:40-03:30", room: "RM" },
    { id: "24", subject: "ES(RS)", time: "03:30-04:20", room: "RS" },
  ],
  5: [ // Friday
    { id: "25", subject: "IKS(AS)", time: "10:30-11:20", room: "AS" },
    { id: "26", subject: "BEE(PM)", time: "11:20-12:10", room: "PM" },
    { id: "27", subject: "FC(GB)", time: "12:10-01:00", room: "GB" },
    { id: "28", subject: "Value Education", time: "04:20-05:10", room: "Auditorium" },
  ],
  6: [ // Saturday
    { id: "29", subject: "EM-I(DKY)", time: "10:30-11:20", room: "DKY" },
    { id: "30", subject: "BEE(PM)", time: "11:20-12:10", room: "PM" },
    { id: "31", subject: "LPCC(RM)", time: "12:10-01:00", room: "RM" },
    { id: "32", subject: "FC(GB)", time: "01:50-02:40", room: "GB" },
    { id: "33", subject: "E-Lab Activity / Sports / Yoga / Social Services", time: "02:40-04:20", room: "Community Services" },
  ],
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 15));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 10, 15));
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [attendance, setAttendance] = useState<Record<string, Record<string, "present" | "absent">>>({});

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const isHoliday = holidays.has(dateKey(selectedDate));

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

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
    let present = 0, absent = 0, total = 0;
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

  const handleAttendanceChange = (classId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [selectedDateKey]: {
        ...(prev[selectedDateKey] || {}),
        [classId]: status,
      },
    }));
  };

  const handleMarkFullDay = (status: "present" | "absent") => {
    const newDateAttendance: Record<string, "present" | "absent"> = {};
    mockClasses.forEach((c) => {
      newDateAttendance[c.id] = status;
    });
    setAttendance((prev) => ({
      ...prev,
      [selectedDateKey]: newDateAttendance,
    }));
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

  const handleUnmark = () => {
    setAttendance((prev) => {
      const newAttendance = { ...prev };
      delete newAttendance[selectedDateKey];
      return newAttendance;
    });
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Attendance Dashboard</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your class attendance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{attendanceStats.percentage}%</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Overall Attendance</p>
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
                    <div className="text-3xl font-bold text-success mb-1">{attendanceStats.present}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Classes Attended</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-error mb-1">{attendanceStats.absent}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Classes Missed</p>
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
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <CardDescription>Select a date to view and mark attendance</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, i) => {
                    if (day === null) {
                      return <div key={`empty-${i}`} className="aspect-square"></div>;
                    }

                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dKey = dateKey(date);
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    const hasAttendance = !!attendance[dKey];
                    const isHolidayDate = holidays.has(dKey);
                    const dayClasses = getClassesForDate(date);
                    const hasClasses = dayClasses.length > 0;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm transition-all ${
                          isSelected
                            ? "bg-primary text-white ring-2 ring-primary/50"
                            : isHolidayDate
                            ? "bg-warning/20 text-warning-foreground border border-warning/30 hover:bg-warning/30"
                            : hasAttendance
                            ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                            : hasClasses
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {day}
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
                    <p className="text-sm font-medium text-warning-foreground">This is a holiday</p>
                  </div>
                ) : classesForDate.length > 0 ? (
                  <div className="space-y-3">
                    {mockClasses.map((cls) => (
                      <div key={cls.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-2">
                        <p className="font-medium text-slate-900 dark:text-white">{cls.subject}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{cls.time} • {cls.room}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAttendanceChange(cls.id, "present")}
                            className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                              attendance[selectedDateKey]?.[cls.id] === "present"
                                ? "bg-success text-white"
                                : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-success/20"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Present
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(cls.id, "absent")}
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No classes scheduled</p>
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
                      isHoliday ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""
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
                <CardDescription>Current: {attendanceStats.percentage}% (Target: 75%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Progress value={Math.min(attendanceStats.percentage, 100)} className="h-2" />
                </div>

                {attendanceStats.percentage < 75 && (
                  <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                    <p className="text-xs text-error-foreground font-medium">
                      ⚠️ Attend {Math.ceil((75 - attendanceStats.percentage) / 10)} more classes to reach 75%
                    </p>
                  </div>
                )}

                {attendanceStats.percentage >= 75 && (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                    <p className="text-xs text-success font-medium">✓ You're meeting the attendance target</p>
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
