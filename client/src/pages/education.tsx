import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Play, Clock, Star } from "lucide-react";

export default function Education() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: educationalContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/educational-content"],
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

  if (isLoading || isLoadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500">Loading educational content...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const articles = educationalContent?.filter((content: any) => content.contentType === 'article') || [];
  const videos = educationalContent?.filter((content: any) => content.contentType === 'video') || [];
  const exercises = educationalContent?.filter((content: any) => content.contentType === 'exercise') || [];

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
                <h1 className="text-2xl font-bold text-gray-900">Learn & Improve</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Expert-curated content to improve your posture knowledge
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Master Perfect Posture
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Discover the fundamentals of maintaining proper posture throughout your day. 
                  Learn evidence-based techniques from posture experts and physical therapists.
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300" 
                  alt="Proper posture demonstration" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" />
              Articles
            </h2>
            <div className="space-y-4">
              {articles.length > 0 ? (
                articles.slice(0, 3).map((article: any) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime || 5} min read
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No articles available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Videos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Play className="w-5 h-5 mr-2 text-secondary" />
              Videos
            </h2>
            <div className="space-y-4">
              {videos.length > 0 ? (
                videos.slice(0, 3).map((video: any) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img 
                          src={video.imageUrl || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=150"} 
                          alt={video.title}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.readTime || 10} min
                        </div>
                        <Button variant="ghost" size="sm" className="text-secondary">
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No videos available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Exercise Guides */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-accent" />
              Exercise Guides
            </h2>
            <div className="space-y-4">
              {exercises.length > 0 ? (
                exercises.slice(0, 3).map((exercise: any) => (
                  <Card key={exercise.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{exercise.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {exercise.readTime || 15} min
                        </div>
                        <Button variant="ghost" size="sm" className="text-accent">
                          Try It
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No exercise guides available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Posture Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Monitor Height</h3>
                <p className="text-sm text-blue-700">
                  Position your monitor so the top of the screen is at or below eye level.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">Feet Position</h3>
                <p className="text-sm text-green-700">
                  Keep your feet flat on the floor or on a footrest, with ankles at 90 degrees.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">Regular Breaks</h3>
                <p className="text-sm text-purple-700">
                  Take a 2-minute posture break every 30 minutes to reset your position.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-medium text-orange-900 mb-2">Shoulder Position</h3>
                <p className="text-sm text-orange-700">
                  Keep shoulders relaxed and avoid rolling them forward or hunching.
                </p>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="font-medium text-pink-900 mb-2">Core Engagement</h3>
                <p className="text-sm text-pink-700">
                  Gently engage your core muscles to support your spine throughout the day.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-900 mb-2">Head Position</h3>
                <p className="text-sm text-indigo-700">
                  Keep your head in a neutral position with ears aligned over your shoulders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}
