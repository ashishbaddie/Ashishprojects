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

// Render array as bars
function renderArray() {
  arrayContainer.innerHTML = ''; // Clear previous array
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
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

// Play button functionality
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
    await mergeSort(); // Assuming you add a merge sort function
  } else if (selectedAlgorithm === 'quick') {
    await quickSort();
  }

  // Mark the final sorted bars
  let barsFinal = document.querySelectorAll('.bar');
  barsFinal.forEach(bar => bar.classList.add('sorted'));
  renderArray(); // Final sorted array

  sortingInProgress = false;
  playButton.disabled = false; // Re-enable play button after sorting
});

// Reset the array to a new random array
resetButton.addEventListener('click', () => {
  generateArray();
  playButton.disabled = false;
  sortingInProgress = false;
});

window.onload = generateArray;
