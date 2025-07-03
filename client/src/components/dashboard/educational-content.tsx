import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Play, ArrowRight } from "lucide-react";

export default function EducationalContent() {
  const { toast } = useToast();

  const { data: educationalContent, isLoading } = useQuery({
    queryKey: ["/api/educational-content"],
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Learn & Improve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden animate-pulse">
              <div className="w-full h-32 bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the first featured content item or use default
  const featuredContent = educationalContent?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Learn & Improve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Featured content with image */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={featuredContent?.imageUrl || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"} 
              alt={featuredContent?.title || "Proper sitting posture demonstration"} 
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              {featuredContent?.title || "Perfect Posture Fundamentals"}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {featuredContent?.description || "Learn the basics of maintaining proper posture throughout your day."}
            </p>
            <Button 
              variant="ghost" 
              className="text-primary text-sm font-medium hover:text-primary/80 p-0"
              onClick={() => window.location.href = "/education"}
            >
              {featuredContent?.contentType === "video" ? "Watch Video" : "Read Article"} 
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <hr className="border-gray-200" />
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">5 Common Posture Mistakes</h3>
            <p className="text-sm text-gray-600 mb-3">Identify and correct the most frequent posture errors.</p>
            <Button 
              variant="ghost" 
              className="text-primary text-sm font-medium hover:text-primary/80 p-0"
              onClick={() => window.location.href = "/education"}
            >
              Watch Video <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
