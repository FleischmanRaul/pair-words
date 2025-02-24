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
