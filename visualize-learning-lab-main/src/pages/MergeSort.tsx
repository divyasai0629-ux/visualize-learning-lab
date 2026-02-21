import SortingVisualizer from "@/components/SortingVisualizer";
import { generateMergeSortSteps } from "@/lib/algorithms";

const MergeSort = () => (
  <SortingVisualizer
    algorithmName="Merge Sort"
    description="A divide-and-conquer algorithm that splits the array and merges sorted halves."
    generateSteps={generateMergeSortSteps}
    timeComplexity="O(n log n)"
    spaceComplexity="O(n)"
  />
);

export default MergeSort;
