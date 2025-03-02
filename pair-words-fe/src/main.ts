import { domElements } from "./dom-elements";
import { gameUI } from "./game-ui";

document.getElementById("start")?.addEventListener("click", () => {
  const pairTarget = parseInt(domElements.pairTargetInput.value);
  const rowNumber = parseInt(domElements.rowNumberInput.value);
  const currentLevel = parseInt(domElements.level.value);
  console.log(`Pair Target: ${pairTarget}, Row Number: ${rowNumber}, Level: ${currentLevel}`);

  domElements.menu?.classList.add("hidden");
  domElements.game?.classList.remove("hidden");
  new gameUI(currentLevel, pairTarget, rowNumber);
});

document.addEventListener("DOMContentLoaded", function () {
  // Set up event handlers for the increment/decrement buttons
  document.querySelectorAll(".input-control").forEach((button) => {
    button.addEventListener("click", function (this: HTMLElement) {
      const action = this.dataset.action;
      const targetId = this.dataset.target;
      if (!action || !targetId) return;
      const input = document.getElementById(targetId);

      if (!input) return;

      const currentValue = parseInt((input as HTMLInputElement).value, 10);
      const min = parseInt((input as HTMLInputElement).min, 10) || 1;
      const max = parseInt((input as HTMLInputElement).max, 10) || 100;

      if (action === "increment") {
        (input as HTMLInputElement).value = Math.min(currentValue + 1, max).toString();
      } else if (action === "decrement") {
        (input as HTMLInputElement).value = Math.max(currentValue - 1, min).toString();
      }

      // Trigger an input event to notify any listeners
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
});
