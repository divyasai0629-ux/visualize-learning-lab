import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Layers, ArrowRight, GitBranch } from "lucide-react";

const categories = [
  {
    name: "Sorting Algorithms",
    icon: BarChart3,
    items: [
      { name: "Bubble Sort", path: "/bubble-sort", desc: "Compare & swap adjacent elements", tc: "O(n²)" },
      { name: "Selection Sort", path: "/selection-sort", desc: "Find minimum, place at start", tc: "O(n²)" },
      { name: "Insertion Sort", path: "/insertion-sort", desc: "Insert each element in order", tc: "O(n²)" },
      { name: "Quick Sort", path: "/quick-sort", desc: "Divide & conquer with pivot partitioning", tc: "O(n log n)" },
      { name: "Merge Sort", path: "/merge-sort", desc: "Split, sort, and merge sub-arrays", tc: "O(n log n)" },
    ],
  },
  {
    name: "Data Structures",
    icon: Layers,
    items: [
      { name: "Stack", path: "/stack", desc: "LIFO — Push & Pop operations", tc: "O(1)" },
      { name: "Singly Linked List", path: "/linked-list", desc: "Linear nodes with next pointers", tc: "O(n)" },
      { name: "Doubly Linked List", path: "/doubly-linked-list", desc: "Nodes with prev & next pointers", tc: "O(n)" },
      { name: "Circular Linked List", path: "/circular-linked-list", desc: "Last node points back to head", tc: "O(n)" },
    ],
  },
  {
    name: "Graph Algorithms",
    icon: GitBranch,
    items: [
      { name: "Graph Traversal", path: "/graph", desc: "DFS, BFS & Dijkstra's algorithm", tc: "O(V+E)" },
    ],
  },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold mb-4 gradient-text"
        >
          DSA Visualizer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Learn algorithms and data structures through interactive, step-by-step animations.
        </motion.p>
      </div>
    </section>

    {/* Categories */}
    <section className="mx-auto max-w-5xl px-6 py-12">
      {categories.map((cat, ci) => (
        <div key={cat.name} className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <cat.icon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{cat.name}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 + i * 0.05 + 0.2 }}
              >
                <Link
                  to={item.path}
                  className="group block p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:glow-border transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{item.tc}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                  <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default Index;
