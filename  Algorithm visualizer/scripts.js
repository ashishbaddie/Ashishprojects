// scripts.js

// Get DOM elements
const arrayContainer = document.getElementById('array-container');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const arraySizeSlider = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const customArrayInput = document.getElementById('customArray');
const setCustomArrayButton = document.getElementById('setCustomArray');
const playButton = document.getElementById('play');
const resetButton = document.getElementById('reset');

let array = [];
let speed = 200; // Default speed (in milliseconds)
let arraySize = arraySizeSlider.value; // Default array size (50)
let sortingInProgress = false; // Track if sorting is in progress
let selectedAlgorithm = null; // Track selected sorting algorithm

// Initialize array with random values
function generateArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 300) + 10); // Random values between 10 and 300
  }
  renderArray();
}

// Render array as bars with numbers
function renderArray() {
  arrayContainer.innerHTML = ''; // Clear previous array
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;

    // Create a label with the value of the array element
    const label = document.createElement('span');
    label.classList.add('bar-label');
    label.textContent = value;

    // Append the label inside the bar
    bar.appendChild(label);
    
    // Append the bar to the array container
    arrayContainer.appendChild(bar);
  });
}

// Update speed and array size
speedSlider.addEventListener('input', () => {
  speed = speedSlider.value;
  speedValue.textContent = `${speed}ms`;
});

arraySizeSlider.addEventListener('input', () => {
  arraySize = arraySizeSlider.value;
  arraySizeValue.textContent = arraySize;
  generateArray();
});

// Set Custom Array
setCustomArrayButton.addEventListener('click', () => {
  const userInput = customArrayInput.value;
  const parsedArray = userInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));

  if (parsedArray.length > 0) {
    array = parsedArray;
    renderArray();
  } else {
    alert('Please enter a valid array of numbers (comma-separated).');
  }
});

// Select sorting algorithm
document.getElementById('start-bubble').addEventListener('click', () => {
  selectedAlgorithm = 'bubble';
  playButton.disabled = false; // Enable play button once an algorithm is selected
});
document.getElementById('start-insertion').addEventListener('click', () => {
  selectedAlgorithm = 'insertion';
  playButton.disabled = false;
});
document.getElementById('start-selection').addEventListener('click', () => {
  selectedAlgorithm = 'selection';
  playButton.disabled = false;
});
document.getElementById('start-merge').addEventListener('click', () => {
  selectedAlgorithm = 'merge';
  playButton.disabled = false;
});
document.getElementById('start-quick').addEventListener('click', () => {
  selectedAlgorithm = 'quick';
  playButton.disabled = false;
});

// Bubble Sort
async function bubbleSort() {
  let bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      bars[j].classList.add('highlight'); // Highlight bars being compared
      bars[j + 1].classList.add('highlight');

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]]; // Swap values
        bars[j].classList.add('swap'); // Add swap class
        bars[j + 1].classList.add('swap');
      }

      await new Promise(resolve => setTimeout(resolve, speed)); // Pause to visualize
      renderArray(); // Re-render after every swap

      bars[j].classList.remove('highlight', 'swap'); // Reset bar color
      bars[j + 1].classList.remove('highlight', 'swap');
    }
  }

  // Mark the final sorted bars
  bars.forEach(bar => bar.classList.add('sorted'));
  renderArray(); // Final sorted array
}

// Insertion Sort
async function insertionSort() {
  let bars = document.querySelectorAll('.bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    bars[i].classList.add('highlight');

    while (j >= 0 && array[j] > key) {
      bars[j].classList.add('highlight');
      array[j + 1] = array[j];
      j--;
      await new Promise(resolve => setTimeout(resolve, speed));
      renderArray();
      bars = document.querySelectorAll('.bar');
    }

    array[j + 1] = key;
    renderArray();
    bars = document.querySelectorAll('.bar');
    bars[i].classList.remove('highlight');
  }

  bars.forEach(bar => bar.classList.add('sorted'));
}

// Selection Sort
async function selectionSort() {
  let bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    bars[minIndex].classList.add('highlight');

    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add('highlight');
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      await new Promise(resolve => setTimeout(resolve, speed));
      bars[j].classList.remove('highlight');
    }

    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    renderArray();
    bars = document.querySelectorAll('.bar');
    bars[minIndex].classList.remove('highlight');
  }

  bars.forEach(bar => bar.classList.add('sorted'));
}

// Merge Sort
async function mergeSort(arr, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Recursively divide the array
    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);

    // Merge the two sorted halves
    await merge(arr, left, mid, right);
  }
}

// Merge helper function
async function merge(arr, left, mid, right) {
  const bars = document.querySelectorAll('.bar');
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const leftArr = new Array(n1);
  const rightArr = new Array(n2);

  // Fill the temporary arrays
  for (let i = 0; i < n1; i++) leftArr[i] = arr[left + i];
  for (let j = 0; j < n2; j++) rightArr[j] = arr[mid + 1 + j];

  let i = 0;
  let j = 0;
  let k = left;

  while (i < n1 && j < n2) {
    // Highlight the bars being compared
    bars[k].classList.add('highlight');

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    await new Promise(resolve => setTimeout(resolve, speed)); // Pause for visualization
    renderArray();

    // Reset the highlight after comparison
    bars[k].classList.remove('highlight');

    k++;
  }

  // Copy remaining elements of leftArr, if any
  while (i < n1) {
    arr[k] = leftArr[i];
    i++;
    k++;
    renderArray();
    await new Promise(resolve => setTimeout(resolve, speed));
  }

  // Copy remaining elements of rightArr, if any
  while (j < n2) {
    arr[k] = rightArr[j];
    j++;
    k++;
    renderArray();
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

// Quick Sort
async function quickSort(arr, low, high) {
  if (low < high) {
    const pivotIndex = await partition(arr, low, high);
    await quickSort(arr, low, pivotIndex - 1);
    await quickSort(arr, pivotIndex + 1, high);
  }
}

// Partition helper function
async function partition(arr, low, high) {
  const bars = document.querySelectorAll('.bar');
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // Highlight the bars being compared
    bars[j].classList.add('highlight');
    bars[high].classList.add('highlight');

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      renderArray();
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    bars[j].classList.remove('highlight');
    bars[high].classList.remove('highlight');
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  renderArray();
  return i + 1;
}

// Play button functionality with Merge Sort and Quick Sort
playButton.addEventListener('click', async () => {
  if (sortingInProgress) return; // Prevent starting a sort if one is already in progress
  sortingInProgress = true;
  playButton.disabled = true; // Disable play button during sorting

  // Execute the selected sorting algorithm
  if (selectedAlgorithm === 'bubble') {
    await bubbleSort();
  } else if (selectedAlgorithm === 'insertion') {
    await insertionSort();
  } else if (selectedAlgorithm === 'selection') {
    await selectionSort();
  } else if (selectedAlgorithm === 'merge') {
    await mergeSort(array, 0, array.length - 1);
  } else if (selectedAlgorithm === 'quick') {
    await quickSort(array, 0, array.length - 1);
  }

  sortingInProgress = false;
  playButton.disabled = false; // Re-enable play button after sorting
});

// Reset the array to a new random array
resetButton.addEventListener('click', () => {
  generateArray();
  playButton.disabled = true; // Disable play button after reset
  sortingInProgress = false;
});

window.onload = generateArray;


