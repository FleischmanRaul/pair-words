import { domElements } from "./dom-elements";
import { GameUI } from "./game-ui";
import { safeParseInt, updateInputValue } from "./utils";

interface InputControlElement extends HTMLElement {
  dataset: {
    action?: string;
    target?: string;
  };
}

const STORAGE_KEYS = {
  PAIR_TARGET: "languageGame_pairTarget",
  ROW_NUMBER: "languageGame_rowNumber",
  LEVEL: "languageGame_level",
};

const saveGameParameters = (): void => {
  if (!domElements.pairTargetInput || !domElements.rowNumberInput || !domElements.level) {
    console.error("Cannot save game parameters: Elements not found");
    return;
  }

  localStorage.setItem(STORAGE_KEYS.PAIR_TARGET, domElements.pairTargetInput.value);
  localStorage.setItem(STORAGE_KEYS.ROW_NUMBER, domElements.rowNumberInput.value);
  localStorage.setItem(STORAGE_KEYS.LEVEL, domElements.level.value);

  console.log("Game parameters saved to local storage");
};

const loadGameParameters = (): void => {
  if (!domElements.pairTargetInput || !domElements.rowNumberInput || !domElements.level) {
    console.error("Cannot load game parameters: Elements not found");
    return;
  }

  const savedPairTarget = localStorage.getItem(STORAGE_KEYS.PAIR_TARGET);
  const savedRowNumber = localStorage.getItem(STORAGE_KEYS.ROW_NUMBER);
  const savedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL);

  if (savedPairTarget) domElements.pairTargetInput.value = savedPairTarget;
  if (savedRowNumber) domElements.rowNumberInput.value = savedRowNumber;
  if (savedLevel) domElements.level.value = savedLevel;

  console.log("Game parameters loaded from local storage");
};

const initializeGame = (): void => {
  if (!domElements.pairTargetInput || !domElements.rowNumberInput || !domElements.level) {
    console.error("Required game elements not found in the DOM");
    return;
  }

  const pairTarget = safeParseInt(domElements.pairTargetInput.value, 10, 1, 500);
  const rowNumber = safeParseInt(domElements.rowNumberInput.value, 5, 1, 10);
  const currentLevel = safeParseInt(domElements.level.value, 1, 1, 20);

  console.log(`Pair Target: ${pairTarget}, Row Number: ${rowNumber}, Level: ${currentLevel}`);

  saveGameParameters();

  if (domElements.menu && domElements.game) {
    domElements.menu.classList.add("hidden");
    domElements.game.classList.remove("hidden");

    new GameUI(currentLevel, pairTarget, rowNumber);
  } else {
    console.error("Game or menu elements not found in the DOM");
  }
};

// Initialize the menu when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadGameParameters();

  const startButton = document.getElementById("start");
  if (startButton) {
    startButton.addEventListener("click", initializeGame);
  } else {
    console.error("Start button not found in the DOM");
  }

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("input-control")) {
      const button = target as InputControlElement;
      const action = button.dataset.action;
      const targetId = button.dataset.target;

      if (action && targetId) {
        updateInputValue(targetId, action);
        saveGameParameters();
      }
    }
  });

  document.querySelectorAll("input[type='number']").forEach((input) => {
    input.addEventListener("change", saveGameParameters);
  });
});
