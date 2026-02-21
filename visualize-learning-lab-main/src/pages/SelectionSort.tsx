import SortingVisualizer from "@/components/SortingVisualizer";
import { generateSelectionSortSteps } from "@/lib/algorithms";

const SelectionSort = () => (
  <SortingVisualizer
    algorithmName="Selection Sort"
    description="Finds the minimum element and places it at the beginning, repeating for the remaining array."
    generateSteps={generateSelectionSortSteps}
    timeComplexity="O(n²)"
    spaceComplexity="O(1)"
  />
);

export default SelectionSort;
