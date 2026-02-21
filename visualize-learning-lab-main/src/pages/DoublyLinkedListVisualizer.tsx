import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AlgorithmLayout from "@/components/AlgorithmLayout";
import ComplexityInfo from "@/components/ComplexityInfo";

let nodeId = 0;

const DoublyLinkedListVisualizer = () => {
  const [nodes, setNodes] = useState<{ id: number; value: number }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [positionValue, setPositionValue] = useState("");
  const [message, setMessage] = useState("Doubly linked list is empty. Insert a node to begin.");
  const [traversalDir, setTraversalDir] = useState<"forward" | "backward" | null>(null);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  const insertAtHead = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes((n) => [{ id: ++nodeId, value: val }, ...n]);
    setMessage(`Inserted ${val} at the head. Updated prev pointer of old head.`);
    setInputValue("");
  };

  const insertAtTail = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes((n) => [...n, { id: ++nodeId, value: val }]);
    setMessage(`Inserted ${val} at the tail. Updated next pointer of old tail.`);
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
    setMessage(`Inserted ${val} at position ${idx}. Updated prev/next pointers of surrounding nodes.`);
    setInputValue("");
    setPositionValue("");
  };

  const deleteAtHead = () => {
    if (nodes.length === 0) { setMessage("List is empty!"); return; }
    const removed = nodes[0];
    setNodes((n) => n.slice(1));
    setMessage(`Deleted ${removed.value} from head. New head's prev is now null.`);
  };

  const deleteAtTail = () => {
    if (nodes.length === 0) { setMessage("List is empty!"); return; }
    const removed = nodes[nodes.length - 1];
    setNodes((n) => n.slice(0, -1));
    setMessage(`Deleted ${removed.value} from tail. New tail's next is now null.`);
  };

  const deleteAtPosition = () => {
    const pos = parseInt(positionValue);
    if (isNaN(pos) || pos < 0 || pos >= nodes.length) { setMessage("Invalid position!"); return; }
    const removed = nodes[pos];
    const newNodes = [...nodes];
    newNodes.splice(pos, 1);
    setNodes(newNodes);
    setMessage(`Deleted ${removed.value} at position ${pos}. Re-linked prev/next pointers.`);
    setPositionValue("");
  };

  const traverse = (dir: "forward" | "backward") => {
    setTraversalDir(dir);
    const order = dir === "forward" ? [...Array(nodes.length).keys()] : [...Array(nodes.length).keys()].reverse();
    let i = 0;
    setHighlightIdx(order[0]);
    setMessage(`Traversing ${dir}... visiting node ${nodes[order[0]]?.value}`);
    const interval = setInterval(() => {
      i++;
      if (i >= order.length) {
        clearInterval(interval);
        setHighlightIdx(null);
        setTraversalDir(null);
        setMessage(`Traversal ${dir} complete!`);
        return;
      }
      setHighlightIdx(order[i]);
      setMessage(`Traversing ${dir}... visiting node ${nodes[order[i]]?.value}`);
    }, 600);
  };

  return (
    <AlgorithmLayout title="Doubly Linked List" description="Each node has pointers to both the next and previous nodes.">
      <ComplexityInfo tc="O(n) traversal, O(1) insert/delete at head/tail" sc="O(n)" />

      <div className="flex gap-3 mb-3 flex-wrap">
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" className="w-28 font-mono" />
        <Input value={positionValue} onChange={(e) => setPositionValue(e.target.value)} placeholder="Position (opt)" className="w-32 font-mono" />
        <Button onClick={insertAtHead}>Insert Head</Button>
        <Button onClick={insertAtTail}>Insert Tail</Button>
        <Button variant="outline" onClick={insertAtPosition}>Insert at Pos</Button>
      </div>
      <div className="flex gap-3 mb-3 flex-wrap">
        <Button variant="outline" onClick={deleteAtHead}>Delete Head</Button>
        <Button variant="outline" onClick={deleteAtTail}>Delete Tail</Button>
        <Button variant="outline" onClick={deleteAtPosition}>Delete at Pos</Button>
      </div>
      <div className="flex gap-3 mb-6">
        <Button variant="secondary" onClick={() => traverse("forward")} disabled={nodes.length === 0 || traversalDir !== null}>Traverse Forward</Button>
        <Button variant="secondary" onClick={() => traverse("backward")} disabled={nodes.length === 0 || traversalDir !== null}>Traverse Backward</Button>
      </div>

      {/* DLL visualization */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 min-h-[120px]">
        <span className="text-xs text-muted-foreground font-mono mr-2 shrink-0">NULL ⇐ HEAD</span>
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
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-mono font-bold text-lg border-2 transition-colors duration-300 ${
                  highlightIdx === idx
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-primary text-primary-foreground border-primary"
                }`}>
                  {node.value}
                </div>
                <div className="flex gap-1 mt-1">
                  <span className="text-[9px] text-muted-foreground">prev</span>
                  <span className="text-[9px] text-muted-foreground">next</span>
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <div className="flex flex-col items-center mx-1">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {nodes.length > 0 && (
          <span className="text-xs text-muted-foreground font-mono ml-2 shrink-0">TAIL ⇒ NULL</span>
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

export default DoublyLinkedListVisualizer;
