import { useState, useCallback } from 'react';
import type { CameraState } from '@/types/fitness';

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    isInitializing: false,
    error: null,
    stream: null,
  });

  const startCamera = useCallback(async () => {
    setCameraState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      setCameraState({
        isActive: true,
        isInitializing: false,
        error: null,
        stream
      });
    } catch (error) {
      let errorMessage = 'Failed to access camera';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        }
      }

      setCameraState({
        isActive: false,
        isInitializing: false,
        error: errorMessage,
        stream: null
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }

    setCameraState({
      isActive: false,
      isInitializing: false,
      error: null,
      stream: null
    });
  }, [cameraState.stream]);

  const captureSnapshot = useCallback(() => {
    // This will be handled by the camera component
    return cameraState.stream;
  }, [cameraState.stream]);

  return {
    isActive: cameraState.isActive,
    isInitializing: cameraState.isInitializing,
    error: cameraState.error,
    stream: cameraState.stream,
    startCamera,
    stopCamera,
    captureSnapshot
  };
}
