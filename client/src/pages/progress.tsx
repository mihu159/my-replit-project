import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Award, Target } from "lucide-react";

export default function Progress() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: progressHistory, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/progress/history"],
    enabled: isAuthenticated,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
  });

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

  if (isLoading || isLoadingProgress || isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/'}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor your posture improvement journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Weekly Progress</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.weeklyProgress || 0}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Sessions Today</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.sessionsToday || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Streak</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.streakDays || 0} days</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Corrections</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.totalCorrections || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Progress chart will be displayed here</p>
                  <p className="text-sm text-gray-400">Chart.js integration needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressHistory && progressHistory.length > 0 ? (
                  progressHistory.slice(0, 5).map((progress: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(progress.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {progress.sessionsCompleted || 0} sessions completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary">
                          {progress.weeklyScore || 0}%
                        </p>
                        <p className="text-sm text-gray-500">
                          {progress.totalCorrections || 0} corrections
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No session history yet</p>
                    <p className="text-sm text-gray-400">Start your first posture analysis session!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Achievements & Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">First Session</h3>
                <p className="text-sm text-gray-500">Complete your first analysis</p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                    Unlocked
                  </span>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-500">Week Warrior</h3>
                <p className="text-sm text-gray-400">Complete 7 days in a row</p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">
                    Locked
                  </span>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-500">Posture Pro</h3>
                <p className="text-sm text-gray-400">Maintain 90%+ score for a week</p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">
                    Locked
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}
