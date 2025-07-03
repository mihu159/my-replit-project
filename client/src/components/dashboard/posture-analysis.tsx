import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Settings } from "lucide-react";

export default function PostureAnalysis() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Real-time Posture Analysis</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Camera Feed Area */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=675" 
            alt="Camera feed showing person at standing desk" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-lg px-4 py-2">
              <p className="text-white text-sm font-medium">Position yourself in the camera frame</p>
            </div>
          </div>
          
          {/* Posture Status Overlay */}
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
            <span className="mr-1">✓</span>
            Good Posture
          </div>
          
          {/* Camera Controls */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Analysis Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shoulder Alignment</span>
              <span className="text-secondary font-semibold">92%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Neck Position</span>
              <span className="text-accent font-semibold">78%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
