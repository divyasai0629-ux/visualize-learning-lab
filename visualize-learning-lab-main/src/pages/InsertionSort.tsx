import SortingVisualizer from "@/components/SortingVisualizer";
import { generateInsertionSortSteps } from "@/lib/algorithms";

const InsertionSort = () => (
  <SortingVisualizer
    algorithmName="Insertion Sort"
    description="Builds the sorted array one element at a time by inserting each into its correct position."
    generateSteps={generateInsertionSortSteps}
    timeComplexity="O(n²)"
    spaceComplexity="O(1)"
  />
);

export default InsertionSort;
