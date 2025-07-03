import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { usePostureDetection } from "@/hooks/usePostureDetection";
import { Camera, Square, Settings, Maximize2, Minimize2 } from "lucide-react";

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    isActive, 
    isInitializing, 
    error, 
    startCamera, 
    stopCamera, 
    captureSnapshot 
  } = useCamera();

  const { 
    postureAnalysis, 
    isAnalyzing, 
    startAnalysis, 
    stopAnalysis 
  } = usePostureDetection(videoRef);

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isActive]);

  const handleToggleCamera = () => {
    if (isActive) {
      stopCamera();
      stopAnalysis();
    } else {
      startCamera();
    }
  };

  const handleStartAnalysis = () => {
    if (isActive) {
      startAnalysis();
    }
  };

  const handleSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Convert to blob and save
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `posture-snapshot-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const getPostureStatus = () => {
    if (!postureAnalysis) return { text: "Initializing...", color: "bg-gray-500" };
    
    if (postureAnalysis.overallScore >= 85) {
      return { text: "Good Posture", color: "bg-secondary" };
    } else if (postureAnalysis.overallScore >= 70) {
      return { text: "Fair Posture", color: "bg-accent" };
    } else {
      return { text: "Poor Posture", color: "bg-red-500" };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-time Posture Analysis</span>
          <div className="flex items-center space-x-2">
            {isActive && (
              <>
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-500">Live</span>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Camera Feed Container */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Posture Analysis Overlay */}
              {postureAnalysis && (
                <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-3 text-white">
                  <div className="text-sm font-medium mb-2">Posture Analysis</div>
                  <div className="space-y-1 text-xs">
                    <div>Shoulders: {Math.round(postureAnalysis.shoulderAlignment)}%</div>
                    <div>Neck: {Math.round(postureAnalysis.neckPosition)}%</div>
                    <div>Spine: {Math.round(postureAnalysis.spineAlignment)}%</div>
                  </div>
                </div>
              )}
              
              {/* Status Indicator */}
              <div className={`absolute top-4 right-4 ${getPostureStatus().color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                ✓ {getPostureStatus().text}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                {error ? (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <p className="text-red-400 font-medium">Camera Error</p>
                    <p className="text-sm text-gray-400 mt-2">{error}</p>
                  </div>
                ) : isInitializing ? (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                    <p className="font-medium">Initializing Camera...</p>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium">Camera is Off</p>
                    <p className="text-sm text-gray-400 mt-2">Click start to begin posture analysis</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Camera Controls */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={handleToggleCamera}
              disabled={isInitializing}
            >
              <Camera className="w-4 h-4" />
            </Button>
            
            {isActive && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={handleSnapshot}
                >
                  <Square className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Analysis Controls */}
          {isActive && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                size="sm"
                className={`${isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                onClick={isAnalyzing ? stopAnalysis : handleStartAnalysis}
              >
                {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isActive && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">
              Position yourself in front of the camera for real-time posture analysis
            </p>
            <Button 
              onClick={handleToggleCamera}
              disabled={isInitializing}
              className="bg-primary hover:bg-primary/90"
            >
              {isInitializing ? 'Initializing...' : 'Start Camera'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
