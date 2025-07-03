import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Camera, TrendingUp, BookOpen, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">PostureTrack Pro</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            AI-Powered
            <span className="text-primary"> Posture Analysis</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Improve your posture, prevent pain, and boost your confidence with our intelligent fitness companion. 
            Get real-time feedback and personalized exercise recommendations.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="w-full flex items-center justify-center px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-white md:py-4 md:text-lg md:px-10"
              >
                Start Your Journey
                <Camera className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Real-time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI analyzes your posture in real-time using your camera for instant feedback.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your improvement with detailed analytics and beautiful progress visualizations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Educational Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access expert-curated exercises, tips, and educational materials for better posture.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Personalized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Customized exercise recommendations and feedback tailored to your specific needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose PostureTrack Pro?</h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Transform your posture and improve your quality of life with our comprehensive approach.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Reduce Back Pain</h3>
                <p className="mt-2 text-base text-gray-500">
                  Improve spinal alignment and reduce chronic back pain through targeted exercises.
                </p>
              </div>
            </div>

            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Boost Confidence</h3>
                <p className="mt-2 text-base text-gray-500">
                  Stand taller and feel more confident with improved posture and presence.
                </p>
              </div>
            </div>

            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Prevent Injuries</h3>
                <p className="mt-2 text-base text-gray-500">
                  Identify and correct poor posture habits before they lead to injuries.
                </p>
              </div>
            </div>

            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Increase Energy</h3>
                <p className="mt-2 text-base text-gray-500">
                  Better posture improves breathing and circulation, boosting your energy levels.
                </p>
              </div>
            </div>

            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Expert Guidance</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access professional advice and evidence-based exercise recommendations.
                </p>
              </div>
            </div>

            <div className="flex">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-secondary mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">24/7 Support</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get continuous monitoring and feedback whenever you need it most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-primary rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white">Ready to Transform Your Posture?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of users who have already improved their posture and quality of life.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="mt-6 bg-white text-primary hover:bg-gray-100"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PostureTrack Pro</span>
            </div>
            <p className="mt-2 text-gray-500">
              Empowering better posture through AI-powered analysis and personalized guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
