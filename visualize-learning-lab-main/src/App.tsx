import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BubbleSort from "./pages/BubbleSort";
import SelectionSort from "./pages/SelectionSort";
import InsertionSort from "./pages/InsertionSort";
import QuickSort from "./pages/QuickSort";
import MergeSort from "./pages/MergeSort";
import StackVisualizer from "./pages/StackVisualizer";
import LinkedListVisualizer from "./pages/LinkedListVisualizer";
import DoublyLinkedListVisualizer from "./pages/DoublyLinkedListVisualizer";
import CircularLinkedListVisualizer from "./pages/CircularLinkedListVisualizer";
import GraphVisualizer from "./pages/GraphVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/selection-sort" element={<SelectionSort />} />
          <Route path="/insertion-sort" element={<InsertionSort />} />
          <Route path="/quick-sort" element={<QuickSort />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          <Route path="/stack" element={<StackVisualizer />} />
          <Route path="/linked-list" element={<LinkedListVisualizer />} />
          <Route path="/doubly-linked-list" element={<DoublyLinkedListVisualizer />} />
          <Route path="/circular-linked-list" element={<CircularLinkedListVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
