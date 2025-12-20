import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  BarChart3,
  Users,
  Lock,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userStr = localStorage.getItem("user");
    if (userStr) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar Interface",
      description: "Navigate any date and mark attendance with a single click",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Track attendance trends with interactive charts and visualizations",
    },
    {
      icon: Clock,
      title: "Timetable Integration",
      description:
        "Auto-populated class schedules from your institution's timetable",
    },
    {
      icon: TrendingUp,
      title: "Attendance Tracking",
      description: "Monitor your attendance percentage and reach your targets",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure system with admin controls and student dashboard",
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "Encrypted storage with audit logs for accountability",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">
                AttendHub
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Smart Attendance Management
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-slate-200 dark:border-slate-700"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Modern Attendance
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Management System
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            A comprehensive, futuristic platform for managing student attendance
            with real-time analytics, smart scheduling, and role-based access
            control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary-dark text-white h-12 px-8 text-lg"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="h-12 px-8 text-lg border-slate-200 dark:border-slate-700"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map(({ icon: Icon, title, description }, idx) => (
            <Card
              key={idx}
              className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 group hover:shadow-xl p-6"
            >
              <div className="flex flex-col h-full">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 flex-1">
                  {description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Why Choose AttendHub?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Institutions", value: "500+" },
              { label: "Students Managed", value: "50K+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Support Available", value: "24/7" },
            ].map(({ label, value }, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{value}</p>
                <p className="text-slate-600 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary via-secondary to-primary/80 rounded-xl p-12 text-center mb-20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Attendance System?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Join institutions worldwide using AttendHub for seamless
              attendance management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/register")}
                className="bg-white text-primary hover:bg-slate-100 h-12 px-8 text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-white/20 hover:bg-white/30 text-white border border-white h-12 px-8 text-lg"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xl text-slate-900 dark:text-white mb-4 font-semibold">
                "AttendHub transformed how we manage attendance across our
                institution."
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                The system is intuitive, reliable, and has reduced
                administrative overhead by 40%. Students appreciate the
                transparency in attendance tracking.
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                Dr. Sarah Johnson
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Director of Academic Affairs, Tech University
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 bg-primary rounded">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  AttendHub
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Smart attendance management for modern institutions
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 AttendHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary">
                Twitter
              </a>
              <a href="#" className="hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
