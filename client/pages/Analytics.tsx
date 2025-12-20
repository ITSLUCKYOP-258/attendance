import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Target, AlertCircle } from "lucide-react";

interface SubjectAttendance {
  subject: string;
  percentage: number;
  total: number;
  present: number;
}

export default function Analytics() {
  const [subjectAttendance, setSubjectAttendance] = useState<
    SubjectAttendance[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectWiseAttendance = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const response = await fetch(
          `/api/attendance/subject-wise?userEmail=${encodeURIComponent(user.email)}`,
        );
        const data = await response.json();

        if (data.success && data.data) {
          setSubjectAttendance(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch subject-wise attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectWiseAttendance();
  }, []);

  // Mock data for attendance trends
  const attendanceTrendData = [
    { month: "Jan", attendance: 85 },
    { month: "Feb", attendance: 82 },
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 79 },
    { month: "May", attendance: 91 },
    { month: "Jun", attendance: 87 },
  ];

  // Mock data for attendance summary
  const attendanceSummary = [
    { name: "Present", value: 78, fill: "#16a34a" },
    { name: "Absent", value: 15, fill: "#dc2626" },
    { name: "Holiday", value: 7, fill: "#eab308" },
  ];

  // Mock data for weekly breakdown
  const weeklyData = [
    { week: "Week 1", classes: 12, attended: 11 },
    { week: "Week 2", classes: 13, attended: 12 },
    { week: "Week 3", classes: 11, attended: 9 },
    { week: "Week 4", classes: 14, attended: 13 },
  ];

  const COLORS = ["#3b82f6", "#dc2626", "#eab308"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Analytics & Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Track your attendance trends and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Current Percentage
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">87.5%</p>
                <p className="text-xs text-success">↑ 2.5% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Classes Attended
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-success">156</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Out of 178 total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Target Status
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-success">On Track</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  12.5% above threshold
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Attendance Streak
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">8 days</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Keep it up!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Attendance Trend */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <CardDescription>
                Your attendance percentage over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Current semester overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceSummary}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>
              Your attendance percentage in each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Loading subject data...
                </p>
              </div>
            ) : subjectAttendance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectAttendance}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="subject"
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar
                    dataKey="percentage"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">
                  No attendance data available yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Breakdown & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Classes */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Weekly Class Attendance</CardTitle>
              <CardDescription>Classes attended this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="classes"
                    fill="hsl(var(--secondary))"
                    name="Total Classes"
                  />
                  <Bar
                    dataKey="attended"
                    fill="hsl(var(--primary))"
                    name="Classes Attended"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Insights & Goals
              </CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="flex gap-3">
                  <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Great Progress!
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You've improved 5% this month
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex gap-3">
                  <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      On Track for Target
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Maintain 75% to graduate
                    </p>
                  </div>
                </div>
              </div>

              {subjectAttendance.length > 0 && subjectAttendance.some((s) => s.percentage < 80) && (
                <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Watch{" "}
                        {
                          subjectAttendance.filter((s) => s.percentage < 80)[0]
                            ?.subject
                        }
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Attendance at{" "}
                        {
                          subjectAttendance.filter((s) => s.percentage < 80)[0]
                            ?.percentage
                        }
                        % in this subject
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Next Milestone
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      6 more classes to reach 90%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
