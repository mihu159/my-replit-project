# Teachable Machine Integration Guide

## Overview
This guide shows how to replace the simulated posture detection with a real Teachable Machine model for pose classification.

## Current Architecture
- **Simulated Detection**: `client/src/hooks/usePostureDetection.ts`
- **Camera Interface**: `client/src/hooks/useCamera.ts`
- **UI Component**: `client/src/components/camera/camera-feed.tsx`

## Integration Steps

### 1. Install TensorFlow.js Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow-models/posenet
```

### 2. Prepare Your Teachable Machine Model

#### Option A: Export from Teachable Machine
1. Go to https://teachablemachine.withgoogle.com/
2. Choose "Pose Project"
3. Train your model with good/bad posture examples
4. Export as "TensorFlow.js" format
5. Download the model files (model.json, weights.bin, metadata.json)

#### Option B: Use Pre-trained PoseNet
The code includes fallback to Google's PoseNet model for general pose detection.

### 3. Replace Detection Logic

#### Update `usePostureDetection.ts`:
```typescript
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

// Load your Teachable Machine model
const loadTeachableMachineModel = async () => {
  const modelURL = '/models/model.json'; // Place your model files in public/models/
  const model = await tf.loadLayersModel(modelURL);
  return model;
};

// Real posture analysis function
const analyzePostureWithTeachableMachine = async (videoElement: HTMLVideoElement, model: tf.LayersModel) => {
  // Convert video frame to tensor
  const videoTensor = tf.browser.fromPixels(videoElement);
  const resized = tf.image.resizeBilinear(videoTensor, [224, 224]); // Adjust size based on your model
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);
  
  // Run prediction
  const prediction = model.predict(batched) as tf.Tensor;
  const results = await prediction.data();
  
  // Clean up tensors
  videoTensor.dispose();
  resized.dispose();
  normalized.dispose();
  batched.dispose();
  prediction.dispose();
  
  // Convert results to posture analysis format
  // Adjust this based on your model's output classes
  const goodPostureConfidence = results[0]; // Assuming first class is "good posture"
  const badPostureConfidence = results[1];  // Assuming second class is "bad posture"
  
  return {
    shoulderAlignment: goodPostureConfidence * 100,
    neckPosition: goodPostureConfidence * 100,
    spineAlignment: goodPostureConfidence * 100,
    overallScore: goodPostureConfidence * 100,
    feedback: goodPostureConfidence > 0.7 ? 'Great posture!' : 'Adjust your posture',
    status: goodPostureConfidence > 0.7 ? 'good' as const : 'warning' as const
  };
};
```

### 4. Model File Structure
Place your Teachable Machine exported files in:
```
public/
  models/
    model.json
    weights.bin
    metadata.json
```

### 5. Alternative: Use PoseNet for Custom Analysis
If you prefer to use Google's PoseNet and create custom posture rules:

```typescript
const loadPoseNetModel = async () => {
  return await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.75
  });
};

const analyzePostureWithPoseNet = async (videoElement: HTMLVideoElement, poseNetModel: any) => {
  const pose = await poseNetModel.estimateSinglePose(videoElement, {
    flipHorizontal: false
  });
  
  // Extract key points
  const keypoints = pose.keypoints;
  const nose = keypoints.find(kp => kp.part === 'nose');
  const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
  const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
  
  // Calculate posture metrics
  const shoulderAlignment = calculateShoulderAlignment(leftShoulder, rightShoulder);
  const neckPosition = calculateNeckPosition(nose, leftShoulder, rightShoulder);
  const spineAlignment = calculateSpineAlignment(keypoints);
  
  const overallScore = (shoulderAlignment + neckPosition + spineAlignment) / 3;
  
  return {
    shoulderAlignment,
    neckPosition,
    spineAlignment,
    overallScore,
    feedback: overallScore > 85 ? 'Excellent posture!' : 'Adjust your alignment',
    status: overallScore > 85 ? 'good' as const : 'warning' as const
  };
};
```

## Complete Integration Example

Here's the complete updated `usePostureDetection.ts` file ready for Teachable Machine:

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import type { PostureAnalysis } from '@/types/fitness';

export function usePostureDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load Teachable Machine model
  const loadModel = useCallback(async () => {
    try {
      const modelURL = '/models/model.json';
      const loadedModel = await tf.loadLayersModel(modelURL);
      setModel(loadedModel);
      console.log('Teachable Machine model loaded successfully');
    } catch (error) {
      console.error('Failed to load Teachable Machine model:', error);
      setError('Failed to load AI model');
    }
  }, []);

  // Real posture analysis with Teachable Machine
  const analyzePosture = useCallback(async () => {
    if (!videoRef.current || !model) return;

    try {
      const videoElement = videoRef.current;
      
      // Convert video frame to tensor
      const videoTensor = tf.browser.fromPixels(videoElement);
      const resized = tf.image.resizeBilinear(videoTensor, [224, 224]);
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);
      
      // Run prediction
      const prediction = model.predict(batched) as tf.Tensor;
      const results = await prediction.data();
      
      // Clean up tensors
      videoTensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      prediction.dispose();
      
      // Process results (adjust based on your model's classes)
      const goodPostureConfidence = results[0];
      const overallScore = goodPostureConfidence * 100;
      
      let status: 'good' | 'warning' | 'error';
      let feedback: string;
      
      if (overallScore >= 85) {
        status = 'good';
        feedback = 'Excellent posture! Keep it up.';
      } else if (overallScore >= 70) {
        status = 'warning';
        feedback = 'Good posture with minor adjustments needed.';
      } else {
        status = 'error';
        feedback = 'Posture needs improvement. Straighten your back.';
      }

      const analysis: PostureAnalysis = {
        shoulderAlignment: overallScore,
        neckPosition: overallScore,
        spineAlignment: overallScore,
        overallScore,
        feedback,
        status
      };

      setPostureAnalysis(analysis);
      setError(null);
    } catch (err) {
      setError('Failed to analyze posture');
      console.error('Posture analysis error:', err);
    }
  }, [videoRef, model]);

  // Initialize model on hook mount
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const startAnalysis = useCallback(() => {
    if (!videoRef.current) {
      setError('No video feed available');
      return;
    }

    if (!model) {
      setError('AI model not loaded yet');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    // Run analysis every 2 seconds (adjust as needed)
    intervalRef.current = setInterval(analyzePosture, 2000);
  }, [analyzePosture, videoRef, model]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    postureAnalysis,
    isAnalyzing,
    error,
    startAnalysis,
    stopAnalysis,
    modelLoaded: !!model
  };
}
```

## Testing Your Integration

1. **Train your Teachable Machine model** with various posture examples
2. **Export and place** the model files in `/public/models/`
3. **Update the confidence thresholds** based on your model's performance
4. **Test thoroughly** with different poses and lighting conditions

## Performance Optimization

- Use `requestAnimationFrame` instead of `setInterval` for smoother analysis
- Implement frame skipping to reduce computational load
- Consider using Web Workers for model inference
- Cache model loading to avoid repeated downloads

## Fallback Strategy

Keep the simulated detection as a fallback when:
- Model fails to load
- Device doesn't support TensorFlow.js
- Camera access is denied

This ensures your app works on all devices, including Kindle Fire tablets with the camera-free exercise mode.