import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AlgorithmLayout from "@/components/AlgorithmLayout";
import ComplexityInfo from "@/components/ComplexityInfo";

let nodeId = 0;

const CircularLinkedListVisualizer = () => {
  const [nodes, setNodes] = useState<{ id: number; value: number }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Circular linked list is empty. Insert a node to begin.");
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [traversing, setTraversing] = useState(false);

  const insertAtHead = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes((n) => [{ id: ++nodeId, value: val }, ...n]);
    setMessage(`Inserted ${val} at head. Last node's next now points to new head.`);
    setInputValue("");
  };

  const insertAtTail = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes((n) => [...n, { id: ++nodeId, value: val }]);
    setMessage(`Inserted ${val} at tail. New tail's next points back to head.`);
    setInputValue("");
  };

  const deleteAtHead = () => {
    if (nodes.length === 0) { setMessage("List is empty!"); return; }
    const removed = nodes[0];
    setNodes((n) => n.slice(1));
    setMessage(`Deleted ${removed.value} from head. Last node now points to new head.`);
  };

  const deleteAtTail = () => {
    if (nodes.length === 0) { setMessage("List is empty!"); return; }
    const removed = nodes[nodes.length - 1];
    setNodes((n) => n.slice(0, -1));
    setMessage(`Deleted ${removed.value} from tail. New tail's next now points to head.`);
  };

  const traverse = () => {
    if (nodes.length === 0) return;
    setTraversing(true);
    let i = 0;
    // Traverse full circle + 1 to show circular nature
    const totalSteps = nodes.length + 1;
    setHighlightIdx(0);
    setMessage(`Traversing... visiting node ${nodes[0]?.value} (head)`);
    const interval = setInterval(() => {
      i++;
      if (i >= totalSteps) {
        clearInterval(interval);
        setHighlightIdx(null);
        setTraversing(false);
        setMessage("Traversal complete! Returned to head — demonstrating circular nature.");
        return;
      }
      const idx = i % nodes.length;
      setHighlightIdx(idx);
      if (i === nodes.length) {
        setMessage(`Back at head (node ${nodes[idx]?.value}) — circular! ✅`);
      } else {
        setMessage(`Traversing... visiting node ${nodes[idx]?.value}`);
      }
    }, 600);
  };

  // Arrange nodes in a circle
  const radius = Math.max(80, nodes.length * 25);
  const centerX = radius + 50;
  const centerY = radius + 50;
  const svgSize = (radius + 50) * 2;

  return (
    <AlgorithmLayout title="Circular Linked List" description="A linked list where the last node points back to the head.">
      <ComplexityInfo tc="O(n) traversal, O(1) insert/delete at head" sc="O(n)" />

      <div className="flex gap-3 mb-3 flex-wrap">
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" className="w-28 font-mono" />
        <Button onClick={insertAtHead}>Insert Head</Button>
        <Button onClick={insertAtTail}>Insert Tail</Button>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <Button variant="outline" onClick={deleteAtHead}>Delete Head</Button>
        <Button variant="outline" onClick={deleteAtTail}>Delete Tail</Button>
        <Button variant="secondary" onClick={traverse} disabled={nodes.length === 0 || traversing}>Traverse</Button>
      </div>

      {/* Circular visualization */}
      <div className="flex justify-center mb-6 overflow-auto">
        {nodes.length === 0 ? (
          <span className="text-muted-foreground text-sm py-16">NULL (empty list)</span>
        ) : (
          <svg width={svgSize} height={svgSize} className="shrink-0">
            {/* Draw arrows between nodes */}
            {nodes.map((_, idx) => {
              const nextIdx = (idx + 1) % nodes.length;
              const angle1 = (2 * Math.PI * idx) / nodes.length - Math.PI / 2;
              const angle2 = (2 * Math.PI * nextIdx) / nodes.length - Math.PI / 2;
              const x1 = centerX + radius * Math.cos(angle1);
              const y1 = centerY + radius * Math.sin(angle1);
              const x2 = centerX + radius * Math.cos(angle2);
              const y2 = centerY + radius * Math.sin(angle2);
              // Shorten line to not overlap circles
              const dx = x2 - x1, dy = y2 - y1;
              const len = Math.sqrt(dx * dx + dy * dy);
              const offset = 24;
              const sx = x1 + (dx / len) * offset;
              const sy = y1 + (dy / len) * offset;
              const ex = x2 - (dx / len) * offset;
              const ey = y2 - (dy / len) * offset;
              return (
                <line key={`edge-${idx}`} x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke="hsl(215, 15%, 50%)" strokeWidth={2} markerEnd="url(#arrowhead)" />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(215, 15%, 50%)" />
              </marker>
            </defs>
            {/* Draw nodes */}
            <AnimatePresence>
              {nodes.map((node, idx) => {
                const angle = (2 * Math.PI * idx) / nodes.length - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const isHighlighted = highlightIdx === idx;
                return (
                  <motion.g key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <circle cx={x} cy={y} r={22}
                      fill={isHighlighted ? "hsl(35, 95%, 55%)" : "hsl(175, 75%, 40%)"}
                      stroke={isHighlighted ? "hsl(35, 95%, 65%)" : "hsl(175, 75%, 50%)"}
                      strokeWidth={2}
                    />
                    <text x={x} y={y} textAnchor="middle" dy="0.35em" fill="hsl(220, 25%, 6%)"
                      fontSize="14" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                      {node.value}
                    </text>
                    <text x={x} y={y - 30} textAnchor="middle" fill="hsl(215, 15%, 50%)"
                      fontSize="10" fontFamily="JetBrains Mono, monospace">
                      {idx === 0 ? "HEAD" : `[${idx}]`}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        )}
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <p className="text-sm">{message}</p>
      </div>
    </AlgorithmLayout>
  );
};

export default CircularLinkedListVisualizer;
