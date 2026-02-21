import SortingVisualizer from "@/components/SortingVisualizer";
import { generateBubbleSortSteps } from "@/lib/algorithms";

const BubbleSort = () => (
  <SortingVisualizer
    algorithmName="Bubble Sort"
    description="Repeatedly compares adjacent elements and swaps them if they're in the wrong order."
    generateSteps={generateBubbleSortSteps}
    timeComplexity="O(n²)"
    spaceComplexity="O(1)"
  />
);

export default BubbleSort;
