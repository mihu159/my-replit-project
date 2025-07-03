import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProgressRing() {
  const { toast } = useToast();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["/api/progress"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = progress?.weeklyScore || stats?.weeklyProgress || 0;
  const sessionsCompleted = progress?.sessionsCompleted || 0;
  const totalCorrections = progress?.totalCorrections || stats?.totalCorrections || 0;
  const improvementPercentage = progress?.improvementPercentage || 0;

  // Calculate circle properties for progress ring
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Ring Visualization */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 progress-ring" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                fill="none" 
                stroke="hsl(220, 13%, 91%)" 
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                fill="none" 
                stroke="hsl(153, 60%, 53%)" 
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sessions</span>
            <span className="text-sm font-medium">{sessionsCompleted}/20</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Corrections</span>
            <span className="text-sm font-medium">{totalCorrections}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Improvement</span>
            <span className={`text-sm font-medium ${improvementPercentage >= 0 ? 'text-secondary' : 'text-red-600'}`}>
              {improvementPercentage >= 0 ? '+' : ''}{Math.round(improvementPercentage)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
