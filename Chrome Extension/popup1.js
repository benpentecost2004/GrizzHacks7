document.addEventListener("DOMContentLoaded", function () {
  const timeAmountElement = document.getElementById("time-amount");
  const coinAmountElement = document.getElementById("coin-amount");

  if (timeAmountElement) {

    let secondsLeft = parseInt(localStorage.getItem("secondsLeft")) || 1200; // 20min
    let secondsWatched = parseInt(localStorage.getItem("secondsWatched")) || 0;
    let BrainCoinsAmount =
      parseInt(localStorage.getItem("BrainCoinsAmount")) || 340;
    let video = document.querySelector("video");
    let minutesLeft = Math.ceil(secondsLeft / 60);
    let minutesWatched = Math.ceil(secondsWatched / 60);

    timeAmountElement.textContent = minutesWatched;
    coinAmountElement.textContent = BrainCoinsAmount;

  } else {
    console.error("Element with id 'time-amount' not found.");
  }
});
