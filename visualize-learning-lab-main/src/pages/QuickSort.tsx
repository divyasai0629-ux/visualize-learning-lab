import SortingVisualizer from "@/components/SortingVisualizer";
import { generateQuickSortSteps } from "@/lib/algorithms";

const QuickSort = () => (
  <SortingVisualizer
    algorithmName="Quick Sort"
    description="A divide-and-conquer algorithm that picks a pivot and partitions the array around it."
    generateSteps={generateQuickSortSteps}
    timeComplexity="O(n log n) avg, O(n²) worst"
    spaceComplexity="O(log n)"
  />
);

export default QuickSort;
