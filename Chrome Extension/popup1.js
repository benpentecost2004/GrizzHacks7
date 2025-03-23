document.addEventListener("DOMContentLoaded", function () {
  // Make sure the element is available before trying to access it
  const timeAmountElement = document.getElementById("time-amount");

  if (timeAmountElement) {
    // Retrieve saved watch time from localStorage (default to 0 if not found)
    const savedWatchTime = localStorage.getItem("watchedTime") || 0;

    // Calculate the number of minutes from savedWatchTime
    const minutesWatched = Math.floor(savedWatchTime / 60);

    // Display the calculated minutes in the element with id "time-amount"
    timeAmountElement.textContent = minutesWatched;
  } else {
    console.error("Element with id 'time-amount' not found.");
  }
});
