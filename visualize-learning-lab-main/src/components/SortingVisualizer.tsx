import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import AlgorithmLayout from "./AlgorithmLayout";
import ComplexityInfo from "./ComplexityInfo";
import AnimationControls from "./AnimationControls";
import { useAlgorithmAnimation } from "@/hooks/useAlgorithmAnimation";
import type { SortStep } from "@/lib/algorithms";

interface Props {
  algorithmName: string;
  description: string;
  generateSteps: (arr: number[]) => SortStep[];
  timeComplexity: string;
  spaceComplexity: string;
}

const SortingVisualizer = ({ algorithmName, description, generateSteps, timeComplexity, spaceComplexity }: Props) => {
  const [inputValue, setInputValue] = useState("64, 34, 25, 12, 22, 11, 90, 45");
  const [steps, setSteps] = useState<SortStep[]>([]);

  const { currentStep, isPlaying, speed, setSpeed, play, pause, stepForward, reset } =
    useAlgorithmAnimation(steps.length);

  const handleGenerate = () => {
    const arr = inputValue.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0);
    if (arr.length < 2) return;
    setSteps(generateSteps(arr));
    reset();
  };

  const handleRandom = () => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setInputValue(arr.join(", "));
    setSteps(generateSteps(arr));
    reset();
  };

  const current = steps[currentStep];
  const maxVal = current ? Math.max(...current.array) : 1;

  return (
    <AlgorithmLayout title={algorithmName} description={description}>
      <ComplexityInfo tc={timeComplexity} sc={spaceComplexity} />

      <div className="flex gap-3 mb-6 flex-wrap">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter comma-separated numbers..."
          className="flex-1 min-w-[200px] font-mono"
        />
        <Button onClick={handleGenerate}>Visualize</Button>
        <Button variant="outline" onClick={handleRandom}>
          <Shuffle className="w-4 h-4 mr-2" /> Random
        </Button>
      </div>

      {current && (
        <>
          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-algo-default" /> Default</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-algo-comparing" /> Comparing</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-algo-swapping" /> Swapping</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-algo-sorted" /> Sorted</span>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1.5 h-64 rounded-lg bg-secondary/30 border border-border p-4">
            {current.array.map((value, idx) => {
              const isComparing = current.comparing.includes(idx);
              const isSwapping = current.swapping.includes(idx);
              const isSorted = current.sorted.includes(idx);
              let bgClass = "bg-algo-default";
              if (isSwapping) bgClass = "bg-algo-swapping";
              else if (isComparing) bgClass = "bg-algo-comparing";
              else if (isSorted) bgClass = "bg-algo-sorted";

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-mono mb-1 text-muted-foreground">{value}</span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${bgClass}`}
                    style={{ height: `${(value / maxVal) * 85}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 rounded-lg bg-card border border-border min-h-[60px]">
            <p className="text-sm">{current.explanation}</p>
          </div>

          <AnimationControls
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onStepForward={stepForward}
            onReset={() => { reset(); }}
            currentStep={currentStep}
            totalSteps={steps.length}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </>
      )}
    </AlgorithmLayout>
  );
};

export default SortingVisualizer;
