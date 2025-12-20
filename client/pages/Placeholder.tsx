import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description?: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{title}</h1>
        {description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{description}</p>
        )}
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          This page is ready to be customized. Let me know what you'd like to build here!
        </p>
        <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary-dark text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
