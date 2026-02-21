import { useState, useEffect, useCallback } from "react";

export function useAlgorithmAnimation(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  useEffect(() => {
    if (!isPlaying || currentStep >= totalSteps - 1) {
      if (currentStep >= totalSteps - 1) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, speed]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const stepForward = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);
  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return { currentStep, isPlaying, speed, setSpeed, play, pause, stepForward, reset };
}
