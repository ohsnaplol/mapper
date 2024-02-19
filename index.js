const { GlobalKeyboardListener } = require('node-global-key-listener');
const fs = require('fs');
const { performance } = require('perf_hooks');

// Create a new key listener
const v = new GlobalKeyboardListener();

// Create an empty object to store the key events
const keyEvents = {};

// Start the timer
let startTime = performance.now();

// Variable to store the time of the last key press
let lastTime = 0;

// Variable to store whether the recording is paused
let isPaused = false;

// Variable to store the time when the recording was paused
let pauseTime = 0;

// Variable to store the total paused time
let totalPausedTime = 0;

// Log every key that's pressed.
v.addListener(function (e, down) {
  // If 'p' is pressed, toggle the paused state
  if (e.name === 'P' && e.state == "DOWN") {
    isPaused = !isPaused;
    if (isPaused) {
      // If the recording is paused, store the current time
      pauseTime = performance.now();
    } else {
      // If the recording is resumed, update the total paused time
      totalPausedTime += performance.now() - pauseTime;
    }
    console.log(isPaused ? 'Recording paused.' : 'Recording resumed.');
    return;
  }

  // If 's' is pressed, save the data structure to a file
  if (e.name === 'S' && e.state == "DOWN") {
    isPaused = !isPaused;
    if (isPaused) {
      // If the recording is paused, store the current time
      pauseTime = performance.now();
    } else {
      // If the recording is resumed, update the total paused time
      totalPausedTime += performance.now() - pauseTime;
    }
    console.log(isPaused ? 'Recording paused.' : 'Recording resumed.');
    return;
  }

  // If the recording is not paused, add the key event to the keyEvents object
  if (!isPaused && e.state == "DOWN") {
    // Calculate the time elapsed since the start of the program, subtracting the total paused time
    const timeElapsed = performance.now() - startTime - totalPausedTime;

    // If the key name starts with 'NUMPAD', replace it with the corresponding integer
    let keyName = e.name.startsWith('NUMPAD') ? e.name.replace('NUMPAD ', '') : e.name;

    // If the time difference between the current key press and the last one is less than or equal to 10ms
    if (timeElapsed - lastTime <= 10) {
      // Append the current key press to the last one
      keyEvents[lastTime] += `, ${keyName}`;
    } else {
      // Otherwise, create a new entry
      keyEvents[timeElapsed] = `${keyName}`;
      // Update the time of the last key press
      lastTime = timeElapsed;
    }
  }
  console.log('\033[2J');
  console.log(keyEvents);
});

// Log a message when the program starts
console.log('Listening for keyboard number events...');