import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Clock, Settings, Lock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage system settings, users, and attendance data</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,234</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Attendance</p>
                  <p className="text-2xl font-bold text-success mt-1">78.5%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Classes Added</p>
                  <p className="text-2xl font-bold text-primary mt-1">45</p>
                </div>
                <Clock className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Data Locked</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">7 days ago</p>
                </div>
                <Lock className="w-8 h-8 text-error opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Timetable Management
              </CardTitle>
              <CardDescription>Edit schedules, add/remove subjects, and manage class timings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/timetable" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Timetables
                  </Button>
                </Link>
                <Link to="/admin/subjects" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Subjects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>Add, edit, or remove student accounts and manage roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/users" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/roles" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Roles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytics & Reporting
              </CardTitle>
              <CardDescription>View attendance trends, heatmaps, and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/analytics" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </Link>
                <Link to="/admin/export" className="w-full">
                  <Button variant="outline" className="w-full">
                    Export Data
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>Configure thresholds, holidays, and lock attendance edits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    Global Settings
                  </Button>
                </Link>
                <Link to="/admin/locks" className="w-full">
                  <Button variant="outline" className="w-full">
                    Lock Management
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
