import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AlgorithmLayout from "@/components/AlgorithmLayout";
import ComplexityInfo from "@/components/ComplexityInfo";

let nodeId = 0;

const LinkedListVisualizer = () => {
  const [nodes, setNodes] = useState<{ id: number; value: number }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [positionValue, setPositionValue] = useState("");
  const [message, setMessage] = useState("Linked list is empty. Insert a node to begin.");

  const insertAtEnd = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes((n) => [...n, { id: ++nodeId, value: val }]);
    setMessage(`Inserted ${val} at the end of the list.`);
    setInputValue("");
  };

  const insertAtPosition = () => {
    const val = parseInt(inputValue);
    const pos = parseInt(positionValue);
    if (isNaN(val) || isNaN(pos)) return;
    const idx = Math.max(0, Math.min(pos, nodes.length));
    const newNodes = [...nodes];
    newNodes.splice(idx, 0, { id: ++nodeId, value: val });
    setNodes(newNodes);
    setMessage(`Inserted ${val} at position ${idx}. Traversed ${idx} node(s) to find insertion point.`);
    setInputValue("");
    setPositionValue("");
  };

  const deleteAtEnd = () => {
    if (nodes.length === 0) { setMessage("List is empty! Nothing to delete."); return; }
    const removed = nodes[nodes.length - 1];
    setNodes((n) => n.slice(0, -1));
    setMessage(`Deleted ${removed.value} from the end.`);
  };

  const deleteAtPosition = () => {
    const pos = parseInt(positionValue);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) { setMessage("Invalid position!"); return; }
    const removed = nodes[pos];
    const newNodes = [...nodes];
    newNodes.splice(pos, 1);
    setNodes(newNodes);
    setMessage(`Deleted ${removed.value} at position ${pos}. Re-linked surrounding nodes.`);
    setPositionValue("");
  };

  return (
    <AlgorithmLayout title="Singly Linked List" description="A linear data structure where each node points to the next.">
      <ComplexityInfo tc="O(n) traversal, O(1) insert/delete at head" sc="O(n)" />

      <div className="flex gap-3 mb-3 flex-wrap">
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" className="w-28 font-mono" />
        <Input value={positionValue} onChange={(e) => setPositionValue(e.target.value)} placeholder="Position (opt)" className="w-32 font-mono" />
        <Button onClick={insertAtEnd}>Insert End</Button>
        <Button variant="outline" onClick={insertAtPosition}>Insert at Pos</Button>
      </div>
      <div className="flex gap-3 mb-6">
        <Button variant="outline" onClick={deleteAtEnd}>Delete End</Button>
        <Button variant="outline" onClick={deleteAtPosition}>Delete at Pos</Button>
      </div>

      {/* Linked List visualization */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 min-h-[100px]">
        <span className="text-xs text-muted-foreground font-mono mr-2 shrink-0">HEAD →</span>
        <AnimatePresence>
          {nodes.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center shrink-0"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-muted-foreground mb-1">[{idx}]</span>
                <div className="w-16 h-16 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-lg border-2 border-primary">
                  {node.value}
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground mx-1" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {nodes.length > 0 && (
          <span className="text-xs text-muted-foreground font-mono ml-2 shrink-0">→ NULL</span>
        )}
        {nodes.length === 0 && (
          <span className="text-muted-foreground text-sm">NULL (empty list)</span>
        )}
      </div>

      <div className="p-4 rounded-lg bg-card border border-border">
        <p className="text-sm">{message}</p>
      </div>
    </AlgorithmLayout>
  );
};

export default LinkedListVisualizer;
