export class UIView {
  constructor() {
    this.winsHeader = document.querySelector("#winTitle");
    this.modal = document.querySelector("#myModal");
    this.header = document.querySelector("header");
    this.playAgainBtn = document.querySelector("#yesBTN");
    this.leaveBtn = document.querySelector("#leaveBTN");
  }

  updateWinCounter(wins) {
    this.winsHeader.innerHTML = `Congratulations, you won ${wins} time${wins !== 1 ? 's' : ''}!`;
  }

  updateTimer(timePlayed) {
    const timerElement = document.querySelector("#timer");
    timerElement.innerHTML = `${timePlayed.toFixed(2)}s`;
  }

  showModal() {
    this.modal.style.display = "flex";
  }

  hideModal() {
    this.modal.style.display = "none";
  }

  adjustLayoutForDifficulty(isCustomMode) {
    if (isCustomMode) {
      this.header.style.marginBottom = "224px";
    } else {
      this.header.style.marginBottom = "500px";
    }
  }

  updateLeaderboard(entries) {
    const body = document.querySelector("#leaderboardBody");
    body.innerHTML = "";

    entries.forEach(entry => {
      const row = document.createElement("div");
      row.className = "leaderboard-row";
      if (entry.isMe) row.classList.add("me");

      row.innerHTML = `
        <span>${entry.rank}</span>
        <span>${entry.username}</span>
        <span>${entry.time}s</span>
      `;

      body.appendChild(row);
    });
  }

  // attachModalClickOutside(callback) {
  //   window.addEventListener("click", (event) => {
  //     if (event.target === this.modal) {
  //       callback();
  //     }
  //   });
  // }

  attachPlayAgainListener(callback) {
    this.playAgainBtn.addEventListener("click", callback);
  }

  attachLeaveListener(callback) {
    this.leaveBtn.addEventListener("click", callback);
  }
}
