// Complete replacement for client/src/hooks/usePostureDetection.ts
// Ready for Teachable Machine integration

import { useState, useCallback, useRef, useEffect } from 'react';
import type { PostureAnalysis } from '@/types/fitness';

// Uncomment these when ready to use Teachable Machine:
// import * as tf from '@tensorflow/tfjs';

export function usePostureDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null); // tf.LayersModel when using TensorFlow
  const [modelLoaded, setModelLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // TEACHABLE MACHINE MODEL LOADER
  // Uncomment and modify this when you have your trained model:
  /*
  const loadTeachableMachineModel = useCallback(async () => {
    try {
      setError(null);
      console.log('Loading Teachable Machine model...');
      
      // Replace with your model URL
      const modelURL = '/models/model.json';
      const loadedModel = await tf.loadLayersModel(modelURL);
      
      setModel(loadedModel);
      setModelLoaded(true);
      console.log('Teachable Machine model loaded successfully');
    } catch (error) {
      console.error('Failed to load Teachable Machine model:', error);
      setError('Failed to load AI model. Using fallback detection.');
      setModelLoaded(false);
      // Fallback to simulated detection
    }
  }, []);
  */

  // TEACHABLE MACHINE ANALYSIS FUNCTION
  // Uncomment and modify this when you have your trained model:
  /*
  const analyzePostureWithTeachableMachine = useCallback(async () => {
    if (!videoRef.current || !model) return;

    try {
      const videoElement = videoRef.current;
      
      // Preprocess video frame for your model
      const videoTensor = tf.browser.fromPixels(videoElement);
      
      // Resize to match your model's input size (usually 224x224 for image models)
      const resized = tf.image.resizeBilinear(videoTensor, [224, 224]);
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);
      
      // Run prediction
      const prediction = model.predict(batched) as tf.Tensor;
      const results = await prediction.data();
      
      // Clean up tensors to prevent memory leaks
      videoTensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      prediction.dispose();
      
      // Process results based on your model's classes
      // Adjust these indices based on your Teachable Machine classes:
      const goodPostureConfidence = results[0]; // First class
      const badPostureConfidence = results[1];  // Second class (if you have one)
      
      const overallScore = goodPostureConfidence * 100;
      
      let status: 'good' | 'warning' | 'error';
      let feedback: string;
      
      if (overallScore >= 80) {
        status = 'good';
        feedback = 'Excellent posture detected!';
      } else if (overallScore >= 60) {
        status = 'warning';
        feedback = 'Fair posture - minor adjustments needed.';
      } else {
        status = 'error';
        feedback = 'Poor posture detected - please adjust your position.';
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
      console.error('Teachable Machine analysis error:', err);
      setError('Analysis failed');
    }
  }, [videoRef, model]);
  */

  // SIMULATED ANALYSIS (Current Implementation)
  // Remove this when you switch to Teachable Machine
  const analyzePostureSimulated = useCallback(() => {
    if (!videoRef.current) return;

    try {
      // Simulate realistic posture detection
      const shoulderAlignment = Math.random() * 30 + 70; // 70-100%
      const neckPosition = Math.random() * 40 + 60; // 60-100%
      const spineAlignment = Math.random() * 35 + 65; // 65-100%
      
      const overallScore = (shoulderAlignment + neckPosition + spineAlignment) / 3;
      
      let status: 'good' | 'warning' | 'error';
      let feedback: string;
      
      if (overallScore >= 85) {
        status = 'good';
        feedback = 'Excellent posture! Keep up the good work.';
      } else if (overallScore >= 70) {
        status = 'warning';
        feedback = 'Good posture with minor adjustments needed.';
      } else {
        status = 'error';
        feedback = 'Posture needs improvement. Focus on alignment.';
      }

      const analysis: PostureAnalysis = {
        shoulderAlignment,
        neckPosition,
        spineAlignment,
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
  }, [videoRef]);

  // Initialize model when component mounts
  useEffect(() => {
    // For Teachable Machine, uncomment this:
    // loadTeachableMachineModel();
    
    // For simulated detection, set as loaded immediately:
    setModelLoaded(true);
  }, []);

  const startAnalysis = useCallback(() => {
    if (!videoRef.current) {
      setError('No video feed available');
      return;
    }

    if (!modelLoaded) {
      setError('AI model not ready yet');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    // Run analysis every 2 seconds
    // For Teachable Machine, use: analyzePostureWithTeachableMachine
    // For simulation, use: analyzePostureSimulated
    intervalRef.current = setInterval(analyzePostureSimulated, 2000);
  }, [videoRef, modelLoaded, analyzePostureSimulated]);

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
      // Clean up TensorFlow model if loaded
      if (model && typeof model.dispose === 'function') {
        model.dispose();
      }
    };
  }, [model]);

  return {
    postureAnalysis,
    isAnalyzing,
    error,
    startAnalysis,
    stopAnalysis,
    modelLoaded
  };
}