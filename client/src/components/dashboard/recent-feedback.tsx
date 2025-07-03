import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import type { FeedbackItem } from "@/types/fitness";

export default function RecentFeedback() {
  const { toast } = useToast();

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["/api/feedback"],
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

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "correction":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "achievement":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "tip":
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  const getFeedbackStyle = (type: string) => {
    switch (type) {
      case "correction":
        return "bg-yellow-50 border-yellow-200";
      case "achievement":
        return "bg-green-50 border-green-200";
      case "tip":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Feedback & Corrections</CardTitle>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Feedback & Corrections</CardTitle>
          <Button 
            variant="ghost" 
            className="text-primary text-sm font-medium hover:text-primary/80"
            onClick={() => window.location.href = "/progress"}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback && feedback.length > 0 ? (
            feedback.slice(0, 3).map((item: FeedbackItem) => (
              <div key={item.id} className={`flex items-start p-4 rounded-lg border ${getFeedbackStyle(item.type)}`}>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    {getFeedbackIcon(item.type)}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <span className="text-xs text-gray-500">{formatTimeAgo(item.createdAt.toString())}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                  {item.type === "correction" && (
                    <Button 
                      variant="ghost" 
                      className="text-primary text-sm font-medium mt-2 hover:text-primary/80 p-0"
                    >
                      View Correction Exercise
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent feedback</p>
              <p className="text-sm text-gray-400">Start a posture analysis session to receive feedback!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
