import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import MobileNav from "@/components/layout/mobile-nav";
import StatsCards from "@/components/dashboard/stats-cards";
import PostureAnalysis from "@/components/dashboard/posture-analysis";
import TodaysExercises from "@/components/dashboard/todays-exercises";
import ProgressRing from "@/components/dashboard/progress-ring";
import QuickActions from "@/components/dashboard/quick-actions";
import EducationalContent from "@/components/dashboard/educational-content";
import RecentFeedback from "@/components/dashboard/recent-feedback";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userName = user.firstName || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, {userName}! 👋
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Let's improve your posture and achieve your wellness goals today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                onClick={() => window.location.href = '/analysis'}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM4 8a1 1 0 000 2h1v3a1 1 0 001 1h3a1 1 0 100-2H7V9a1 1 0 00-1-1H4z"/>
                </svg>
                Start Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Posture Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <PostureAnalysis />
            <TodaysExercises />
          </div>

          {/* Right Column - Progress & Education */}
          <div className="space-y-6">
            <ProgressRing />
            <QuickActions />
            <EducationalContent />
          </div>
        </div>

        {/* Recent Feedback */}
        <RecentFeedback />
      </main>

      <MobileNav />
    </div>
  );
}
