import { domElements } from "./dom-elements";
import { gameUI } from "./game-ui";

document.getElementById("start")?.addEventListener("click", () => {
  const pairTarget = domElements.pairTargetInput.value;
  const rowNumber = domElements.rowNumberInput.value;
  console.log(`Pair Target: ${pairTarget}, Row Number: ${rowNumber}`);

  const container = domElements.checkboxContainer;
  const selectedCategories = Array.from(
    container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.id);
  console.log("Selected Categories:", selectedCategories);

  domElements.menu?.classList.add("hidden");
  domElements.game?.classList.remove("hidden");

  new gameUI(selectedCategories, parseInt(pairTarget), parseInt(rowNumber));
});
