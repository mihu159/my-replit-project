import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Timer } from "lucide-react";

export default function MobileExercise() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: exercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: ["/api/exercises", { category: "posture" }],
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

  if (isLoading || isLoadingExercises) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const mobileExercises = [
    {
      id: 1,
      name: "Neck Stretches",
      description: "Gentle neck movements to improve flexibility",
      duration: 3,
      instructions: [
        "Slowly turn your head to the right, hold for 10 seconds",
        "Return to center, then turn left, hold for 10 seconds",
        "Tilt your head to the right shoulder, hold for 10 seconds",
        "Return to center, then tilt to the left shoulder",
        "Repeat the sequence 3 times"
      ]
    },
    {
      id: 2,
      name: "Shoulder Rolls",
      description: "Release tension in shoulders and upper back",
      duration: 2,
      instructions: [
        "Sit or stand with arms at your sides",
        "Slowly roll shoulders forward in a circular motion 5 times",
        "Reverse direction, rolling backwards 5 times",
        "Lift shoulders up to ears, hold for 5 seconds, then release",
        "Repeat the entire sequence"
      ]
    },
    {
      id: 3,
      name: "Spinal Twist",
      description: "Improve spinal mobility and posture",
      duration: 4,
      instructions: [
        "Sit tall in your chair with feet flat on floor",
        "Place right hand on left knee",
        "Slowly twist your torso to the left, looking over left shoulder",
        "Hold for 15 seconds, return to center",
        "Repeat on the other side",
        "Complete 3 full cycles"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = '/'}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Camera-Free Exercises</h1>
              <p className="text-sm text-gray-500">
                Perfect for tablets and devices without camera access
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Kindle Fire & Tablet Friendly</h3>
            <p className="text-sm text-blue-700">
              These exercises are designed to work on any device. No camera required - just follow the guided instructions and timer.
            </p>
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mobileExercises.map((exercise) => (
            <Card key={exercise.id} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{exercise.name}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="w-4 h-4 mr-1" />
                    {exercise.duration} min
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Instructions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Instructions:</h4>
                    <ol className="space-y-2">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex text-sm text-gray-600">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      <Play className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Exercise Tips for Mobile Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Perfect for Kindle Fire</h3>
                  <p className="text-sm text-green-700">
                    These exercises work great on tablets. You can prop up your device and follow along easily.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">No Camera Needed</h3>
                  <p className="text-sm text-blue-700">
                    All exercises use guided instructions and timers instead of camera tracking.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-900 mb-2">Take Regular Breaks</h3>
                  <p className="text-sm text-purple-700">
                    Set reminders to do these exercises every 30-60 minutes while reading or working.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-medium text-orange-900 mb-2">Track Progress</h3>
                  <p className="text-sm text-orange-700">
                    Mark exercises as completed to build healthy habits and track your consistency.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Compatibility */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Device Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <h3 className="font-medium text-green-900">Kindle Fire Tablets</h3>
                  <p className="text-sm text-green-700">Fully compatible with exercise instructions and timers</p>
                </div>
                <span className="text-green-600 font-medium">✓ Compatible</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <h3 className="font-medium text-yellow-900">Kindle E-readers</h3>
                  <p className="text-sm text-yellow-700">Limited browser support - reading mode only</p>
                </div>
                <span className="text-yellow-600 font-medium">⚠ Limited</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <h3 className="font-medium text-green-900">Smartphones & Tablets</h3>
                  <p className="text-sm text-green-700">Full camera support plus exercise alternatives</p>
                </div>
                <span className="text-green-600 font-medium">✓ Full Support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}