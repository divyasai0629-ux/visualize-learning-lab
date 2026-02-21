import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AlgorithmLayout from "@/components/AlgorithmLayout";
import ComplexityInfo from "@/components/ComplexityInfo";

const StackVisualizer = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Stack is empty. Push an element to begin.");

  const push = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setStack((s) => [...s, val]);
    setMessage(`Pushed ${val} onto the stack. It's now the top element.`);
    setInputValue("");
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack underflow! Cannot pop from an empty stack.");
      return;
    }
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setMessage(`Popped ${top} from the stack.${stack.length === 1 ? " Stack is now empty." : ` New top: ${stack[stack.length - 2]}.`}`);
  };

  return (
    <AlgorithmLayout title="Stack" description="LIFO (Last In, First Out) data structure — Push and Pop operations.">
      <ComplexityInfo tc="O(1) per operation" sc="O(n)" />

      <div className="flex gap-3 mb-6">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number..."
          className="w-40 font-mono"
          onKeyDown={(e) => e.key === "Enter" && push()}
        />
        <Button onClick={push}>Push</Button>
        <Button variant="outline" onClick={pop}>Pop</Button>
      </div>

      {/* Stack visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 min-h-[320px] border-l-2 border-r-2 border-b-2 border-border rounded-b-lg flex flex-col-reverse items-center gap-1.5 p-3">
          <AnimatePresence>
            {stack.map((val, idx) => (
              <motion.div
                key={`${idx}-${val}`}
                initial={{ opacity: 0, scale: 0.5, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -30 }}
                transition={{ duration: 0.3 }}
                className={`w-full py-3 rounded-md text-center font-mono font-semibold ${
                  idx === stack.length - 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {val}
              </motion.div>
            ))}
          </AnimatePresence>
          {stack.length === 0 && (
            <span className="text-muted-foreground text-sm absolute top-1/2 -translate-y-1/2">Empty</span>
          )}
          {stack.length > 0 && (
            <span className="absolute -right-14 top-0 text-xs text-primary font-mono">← Top</span>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <p className="text-sm">{message}</p>
      </div>
    </AlgorithmLayout>
  );
};

export default StackVisualizer;
