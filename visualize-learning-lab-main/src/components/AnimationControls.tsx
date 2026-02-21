import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Props {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls = ({
  isPlaying, onPlay, onPause, onStepForward, onReset,
  currentStep, totalSteps, speed, onSpeedChange,
}: Props) => (
  <div className="flex flex-col gap-3 mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
    <div className="flex items-center gap-3">
      <Button size="icon" variant="outline" onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button size="icon" variant="outline" onClick={onStepForward} disabled={isPlaying}>
        <SkipForward className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="outline" onClick={onReset}>
        <RotateCcw className="w-4 h-4" />
      </Button>
      <span className="text-sm text-muted-foreground ml-2">
        Step {currentStep + 1} / {totalSteps}
      </span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-12">Speed</span>
      <Slider
        value={[1000 - speed]}
        min={0}
        max={900}
        step={100}
        onValueChange={([v]) => onSpeedChange(1000 - v)}
        className="w-40"
      />
      <span className="text-xs text-muted-foreground">{speed}ms</span>
    </div>
  </div>
);

export default AnimationControls;
