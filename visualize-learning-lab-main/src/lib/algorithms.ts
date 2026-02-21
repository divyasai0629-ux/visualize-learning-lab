export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  explanation: string;
}

export function generateBubbleSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], explanation: "Starting Bubble Sort. We'll compare adjacent elements and swap if needed." });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], explanation: `Comparing ${a[j]} and ${a[j + 1]}.` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], explanation: `${a[j + 1]} > ${a[j]}, so we swap them.` });
      } else {
        steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], explanation: `${a[j]} ≤ ${a[j + 1]}, no swap needed.` });
      }
    }
    sorted.push(n - 1 - i);
  }
  sorted.push(0);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), explanation: "✅ Array is fully sorted!" });
  return steps;
}

export function generateSelectionSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], explanation: "Starting Selection Sort. We'll find the minimum element and place it at the beginning." });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: [...sorted], explanation: `Looking for the minimum element starting from index ${i}. Current minimum: ${a[i]}.` });

    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted], explanation: `Comparing current minimum ${a[minIdx]} with ${a[j]}.` });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], comparing: [minIdx], swapping: [], sorted: [...sorted], explanation: `Found new minimum: ${a[minIdx]} at index ${minIdx}.` });
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], explanation: `Swapping ${a[minIdx]} and ${a[i]} to place minimum at index ${i}.` });
    }
    sorted.push(i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], explanation: `${a[i]} is now in its correct position at index ${i}.` });
  }
  sorted.push(n - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), explanation: "✅ Array is fully sorted!" });
  return steps;
}

export function generateInsertionSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [0], explanation: "Starting Insertion Sort. First element is already 'sorted'." });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: Array.from({ length: i }, (_, k) => k), explanation: `Picking ${key} to insert into the sorted portion.` });

    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: Array.from({ length: i }, (_, k) => k), explanation: `${a[j]} > ${key}, shifting ${a[j]} to the right.` });
      a[j + 1] = a[j];
      steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => k), explanation: `Shifted ${a[j]} to index ${j + 1}.` });
      j--;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: i + 1 }, (_, k) => k), explanation: `Inserted ${key} at index ${j + 1}.` });
  }

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), explanation: "✅ Array is fully sorted!" });
  return steps;
}

export function generateQuickSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sortedIndices = new Set<number>();

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], explanation: "Starting Quick Sort. We pick a pivot and partition the array around it." });

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) sortedIndices.add(low);
      return;
    }
    const pivotVal = a[high];
    steps.push({ array: [...a], comparing: [high], swapping: [], sorted: [...sortedIndices], explanation: `Choosing pivot: ${pivotVal} (last element). Partitioning range [${low}..${high}].` });

    let i = low;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [...sortedIndices], explanation: `Comparing ${a[j]} with pivot ${pivotVal}.` });
      if (a[j] <= pivotVal) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: [...a], comparing: [], swapping: [i, j], sorted: [...sortedIndices], explanation: `${a[j]} ≤ ${pivotVal}, swapped ${a[i]} and ${a[j]}.` });
        } else {
          steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sortedIndices], explanation: `${a[j]} ≤ ${pivotVal}, already in place.` });
        }
        i++;
      }
    }
    if (i !== high) {
      [a[i], a[high]] = [a[high], a[i]];
      steps.push({ array: [...a], comparing: [], swapping: [i, high], sorted: [...sortedIndices], explanation: `Placing pivot ${pivotVal} at its correct position (index ${i}).` });
    }
    sortedIndices.add(i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sortedIndices], explanation: `Pivot ${pivotVal} is now at index ${i}. Recursing on sub-arrays.` });

    quickSort(low, i - 1);
    quickSort(i + 1, high);
  }

  quickSort(0, n - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), explanation: "✅ Array is fully sorted!" });
  return steps;
}

export function generateMergeSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sortedIndices = new Set<number>();

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], explanation: "Starting Merge Sort. We recursively split the array and merge sorted halves." });

  function mergeSort(left: number, right: number) {
    if (left >= right) {
      if (left === right) sortedIndices.add(left);
      return;
    }
    const mid = Math.floor((left + right) / 2);
    steps.push({ array: [...a], comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i), swapping: [], sorted: [...sortedIndices], explanation: `Splitting [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].` });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);

    // Merge
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sortedIndices], explanation: `Merging [${left}..${mid}] and [${mid + 1}..${right}].` });

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ array: [...a], comparing: [left + i, mid + 1 + j], swapping: [], sorted: [...sortedIndices], explanation: `Comparing ${leftArr[i]} and ${rightArr[j]}.` });
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        steps.push({ array: [...a], comparing: [], swapping: [k], sorted: [...sortedIndices], explanation: `Placing ${leftArr[i]} at index ${k}.` });
        i++;
      } else {
        a[k] = rightArr[j];
        steps.push({ array: [...a], comparing: [], swapping: [k], sorted: [...sortedIndices], explanation: `Placing ${rightArr[j]} at index ${k}.` });
        j++;
      }
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i];
      steps.push({ array: [...a], comparing: [], swapping: [k], sorted: [...sortedIndices], explanation: `Placing remaining ${leftArr[i]} at index ${k}.` });
      i++; k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j];
      steps.push({ array: [...a], comparing: [], swapping: [k], sorted: [...sortedIndices], explanation: `Placing remaining ${rightArr[j]} at index ${k}.` });
      j++; k++;
    }
    for (let x = left; x <= right; x++) sortedIndices.add(x);
  }

  mergeSort(0, n - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), explanation: "✅ Array is fully sorted!" });
  return steps;
}
