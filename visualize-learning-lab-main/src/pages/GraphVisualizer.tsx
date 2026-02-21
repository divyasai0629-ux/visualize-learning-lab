import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AlgorithmLayout from "@/components/AlgorithmLayout";
import ComplexityInfo from "@/components/ComplexityInfo";

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

const GraphVisualizer = () => {
  const [nodesInput, setNodesInput] = useState("A, B, C, D, E");
  const [edgesInput, setEdgesInput] = useState("A-B, A-C, B-D, C-D, D-E");
  const [weighted, setWeighted] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [visitedEdges, setVisitedEdges] = useState<Set<string>>(new Set());
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [message, setMessage] = useState("Define nodes and edges, then click Build Graph.");
  const [traversing, setTraversing] = useState(false);
  const [startNode, setStartNode] = useState("A");

  const buildGraph = useCallback(() => {
    const nodeNames = nodesInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (nodeNames.length === 0) { setMessage("Enter at least one node."); return; }

    // Position nodes in a circle
    const radius = Math.min(150, nodeNames.length * 30);
    const cx = 200, cy = 200;
    const nodes: GraphNode[] = nodeNames.map((id, i) => {
      const angle = (2 * Math.PI * i) / nodeNames.length - Math.PI / 2;
      return { id, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });

    const edges: GraphEdge[] = edgesInput.split(",").map((s) => s.trim()).filter(Boolean).map((e) => {
      // Support format: A-B or A-B:5 (weighted)
      const [pair, w] = e.split(":");
      const [from, to] = pair.split("-").map((s) => s.trim());
      return { from, to, weight: w ? parseInt(w) : undefined };
    }).filter((e) => nodeNames.includes(e.from) && nodeNames.includes(e.to));

    setGraphNodes(nodes);
    setGraphEdges(edges);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentNode(null);
    setMessage(`Graph built with ${nodes.length} nodes and ${edges.length} edges. Choose a traversal algorithm.`);
  }, [nodesInput, edgesInput]);

  const getAdjList = useCallback(() => {
    const adj: Record<string, { node: string; weight?: number }[]> = {};
    graphNodes.forEach((n) => { adj[n.id] = []; });
    graphEdges.forEach((e) => {
      adj[e.from]?.push({ node: e.to, weight: e.weight });
      adj[e.to]?.push({ node: e.from, weight: e.weight });
    });
    return adj;
  }, [graphNodes, graphEdges]);

  const animateTraversal = useCallback((order: { node: string; edge?: string }[]) => {
    setTraversing(true);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentNode(null);
    let i = 0;
    const visited = new Set<string>();
    const visitedE = new Set<string>();

    const step = () => {
      if (i >= order.length) {
        setCurrentNode(null);
        setTraversing(false);
        setMessage("Traversal complete! ✅");
        return;
      }
      const { node, edge } = order[i];
      visited.add(node);
      if (edge) visitedE.add(edge);
      setVisitedNodes(new Set(visited));
      setVisitedEdges(new Set(visitedE));
      setCurrentNode(node);
      setMessage(`Visiting node ${node}${edge ? ` via edge ${edge}` : ""}.`);
      i++;
      setTimeout(step, 800);
    };
    step();
  }, []);

  const runBFS = () => {
    const adj = getAdjList();
    if (!adj[startNode]) { setMessage(`Node ${startNode} not found!`); return; }
    const order: { node: string; edge?: string }[] = [];
    const visited = new Set<string>();
    const queue = [startNode];
    visited.add(startNode);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push({ node: curr });
      for (const neighbor of adj[curr] || []) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          const edgeKey = [curr, neighbor.node].sort().join("-");
          order.push({ node: neighbor.node, edge: edgeKey });
          queue.push(neighbor.node);
        }
      }
    }
    animateTraversal(order);
  };

  const runDFS = () => {
    const adj = getAdjList();
    if (!adj[startNode]) { setMessage(`Node ${startNode} not found!`); return; }
    const order: { node: string; edge?: string }[] = [];
    const visited = new Set<string>();

    const dfs = (node: string, fromEdge?: string) => {
      visited.add(node);
      order.push({ node, edge: fromEdge });
      for (const neighbor of adj[node] || []) {
        if (!visited.has(neighbor.node)) {
          const edgeKey = [node, neighbor.node].sort().join("-");
          dfs(neighbor.node, edgeKey);
        }
      }
    };
    dfs(startNode);
    animateTraversal(order);
  };

  const runDijkstra = () => {
    const adj = getAdjList();
    if (!adj[startNode]) { setMessage(`Node ${startNode} not found!`); return; }

    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();
    graphNodes.forEach((n) => { dist[n.id] = Infinity; prev[n.id] = null; });
    dist[startNode] = 0;

    const order: { node: string; edge?: string }[] = [];

    for (let i = 0; i < graphNodes.length; i++) {
      let minNode: string | null = null;
      let minDist = Infinity;
      for (const n of graphNodes) {
        if (!visited.has(n.id) && dist[n.id] < minDist) {
          minDist = dist[n.id];
          minNode = n.id;
        }
      }
      if (!minNode) break;
      visited.add(minNode);
      const edge = prev[minNode] ? [prev[minNode], minNode].sort().join("-") : undefined;
      order.push({ node: minNode, edge });

      for (const neighbor of adj[minNode] || []) {
        const w = neighbor.weight ?? 1;
        if (dist[minNode] + w < dist[neighbor.node]) {
          dist[neighbor.node] = dist[minNode] + w;
          prev[neighbor.node] = minNode;
        }
      }
    }
    animateTraversal(order);
  };

  const getNodePos = (id: string) => graphNodes.find((n) => n.id === id);

  return (
    <AlgorithmLayout title="Graph Traversal" description="Visualize DFS, BFS, and Dijkstra's shortest path on graphs.">
      <ComplexityInfo tc="O(V + E) for BFS/DFS" sc="O(V)" />

      <div className="grid gap-3 mb-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nodes (comma-separated)</label>
          <Input value={nodesInput} onChange={(e) => setNodesInput(e.target.value)} className="font-mono" placeholder="A, B, C, D" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Edges (format: A-B or A-B:5 for weighted)
          </label>
          <Textarea value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className="font-mono min-h-[40px]" placeholder="A-B, B-C:3" />
        </div>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap items-end">
        <Button onClick={buildGraph}>Build Graph</Button>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Start Node</label>
          <Input value={startNode} onChange={(e) => setStartNode(e.target.value.trim())} className="w-20 font-mono" />
        </div>
        <Button variant="secondary" onClick={runBFS} disabled={graphNodes.length === 0 || traversing}>BFS</Button>
        <Button variant="secondary" onClick={runDFS} disabled={graphNodes.length === 0 || traversing}>DFS</Button>
        <Button variant="secondary" onClick={runDijkstra} disabled={graphNodes.length === 0 || traversing}>Dijkstra</Button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={weighted} onChange={(e) => setWeighted(e.target.checked)} />
          Weighted
        </label>
      </div>

      {/* Graph visualization */}
      <div className="flex justify-center mb-6 overflow-auto">
        {graphNodes.length === 0 ? (
          <div className="py-20 text-muted-foreground text-sm">Build a graph to visualize it here.</div>
        ) : (
          <svg width={400} height={400} className="shrink-0 rounded-lg border border-border bg-secondary/20">
            {/* Edges */}
            {graphEdges.map((edge, idx) => {
              const from = getNodePos(edge.from);
              const to = getNodePos(edge.to);
              if (!from || !to) return null;
              const edgeKey = [edge.from, edge.to].sort().join("-");
              const isVisited = visitedEdges.has(edgeKey);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isVisited ? "hsl(35, 95%, 55%)" : "hsl(215, 15%, 35%)"}
                    strokeWidth={isVisited ? 3 : 2}
                    className="transition-all duration-300"
                  />
                  {weighted && edge.weight != null && (
                    <text x={mx} y={my - 8} textAnchor="middle" fill="hsl(210, 20%, 75%)"
                      fontSize="11" fontFamily="JetBrains Mono, monospace">
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Nodes */}
            {graphNodes.map((node) => {
              const isVisited = visitedNodes.has(node.id);
              const isCurrent = currentNode === node.id;
              return (
                <motion.g key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <circle
                    cx={node.x} cy={node.y} r={20}
                    fill={isCurrent ? "hsl(340, 80%, 55%)" : isVisited ? "hsl(35, 95%, 55%)" : "hsl(175, 75%, 40%)"}
                    stroke={isCurrent ? "hsl(340, 80%, 65%)" : isVisited ? "hsl(35, 95%, 65%)" : "hsl(175, 75%, 50%)"}
                    strokeWidth={2}
                    className="transition-all duration-300"
                  />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                    fill="hsl(220, 25%, 6%)" fontSize="13" fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace">
                    {node.id}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend */}
      {graphNodes.length > 0 && (
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(175, 75%, 40%)" }} /> Unvisited</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(35, 95%, 55%)" }} /> Visited</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "hsl(340, 80%, 55%)" }} /> Current</span>
        </div>
      )}

      <div className="p-4 rounded-lg bg-card border border-border">
        <p className="text-sm">{message}</p>
      </div>
    </AlgorithmLayout>
  );
};

export default GraphVisualizer;
