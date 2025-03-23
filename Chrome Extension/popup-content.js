import {
  preloadResource,
  showPopup,
  trackYouTubeWatchTime,
} from "functions-content.js";

function mainFunction() {
  // log everything just to see
  console.log(`secondsLeft: ${secondsLeft} seconds`);
  console.log(`secondsWatched: ${secondsWatched} seconds`);
  console.log(`minutesLeft: ${minutesLeft} minutes`);
  console.log(`minutesWatched: ${minutesWatched} minutes`);

  // Call the preload function as soon as the DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    preloadResource(); // Preload resource before running the main function
  });

  trackYouTubeWatchTime();
  
  if (video) {
    video.pause();
    console.log("Video paused");
  }
  showPopup().catch(err => console.error("Error showing popup:", err));
}

setTimeout(mainFunction, 2000); // Delay of 2000 milliseconds (2 seconds)
