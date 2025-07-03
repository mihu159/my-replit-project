import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Play, CheckCircle, Clock, User } from "lucide-react";
import type { ExerciseWithDetails } from "@/types/fitness";

export default function TodaysExercises() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todaysExercises, isLoading } = useQuery({
    queryKey: ["/api/user-exercises/today"],
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

  const updateExerciseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      await apiRequest("PUT", `/api/user-exercises/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-exercises/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
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
      toast({
        title: "Error",
        description: "Failed to update exercise status",
        variant: "destructive",
      });
    },
  });

  const handleExerciseAction = (exerciseId: number, status: string) => {
    const updates: any = { status };
    
    if (status === "in_progress") {
      updates.startTime = new Date().toISOString();
    } else if (status === "completed") {
      updates.endTime = new Date().toISOString();
    }

    updateExerciseMutation.mutate({ id: exerciseId, updates });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
            Scheduled
          </span>
        );
    }
  };

  const getExerciseIcon = (category: string) => {
    switch (category) {
      case "posture":
        return <User className="text-primary" />;
      case "strength":
        return <CheckCircle className="text-secondary" />;
      default:
        return <Clock className="text-accent" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Today's Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Today's Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysExercises && todaysExercises.length > 0 ? (
            todaysExercises.map((userExercise: ExerciseWithDetails) => (
              <div key={userExercise.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    {getExerciseIcon(userExercise.exercise.category)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">{userExercise.exercise.name}</h3>
                  <p className="text-sm text-gray-500">
                    {userExercise.exercise.duration} minutes • {userExercise.exercise.difficulty}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(userExercise.status)}
                  {userExercise.status !== "completed" && (
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary/80"
                      onClick={() => handleExerciseAction(
                        userExercise.id, 
                        userExercise.status === "scheduled" ? "in_progress" : "completed"
                      )}
                      disabled={updateExerciseMutation.isPending}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exercises scheduled for today</p>
              <p className="text-sm text-gray-400">Start your first posture analysis session!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
