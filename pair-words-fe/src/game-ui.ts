import { GamePairNtoN, GameState, GameStatistics, Mistake } from "./game";
import { WordMachine } from "./word-machine";
import { domElements } from "./dom-elements";

type GameBoardElements = {
  leftColumn: HTMLDivElement;
  rightColumn: HTMLDivElement;
};

type GameToolbarElements = {
  correctAnswers: HTMLDivElement;
  incorrectAnswers: HTMLDivElement;
  timer: HTMLDivElement;
  returnButton: HTMLButtonElement;
};

export class GameUI {
  private game: GamePairNtoN;
  private gameState: GameState;
  private gameBoardElements: GameBoardElements;
  private GameToolbarElements: GameToolbarElements;
  private intervalId: number = 0;

  constructor(level: number, pairTarget: number, rowNumber: number) {
    const wordMachine = new WordMachine(level);
    this.game = new GamePairNtoN(wordMachine, pairTarget, rowNumber);
    this.gameState = this.game.startGame();
    this.GameToolbarElements = this.setupToolbar();
    this.gameBoardElements = this.setupGameBoard(rowNumber);

    this.refreshGameState();
  }

  private setupToolbar(): GameToolbarElements {
    if (domElements.gameToolbar) {
      domElements.gameToolbar.innerHTML = "";
    }
    const GameToolbarElements = {
      correctAnswers: document.createElement("div"),
      incorrectAnswers: document.createElement("div"),
      timer: document.createElement("div"),
      returnButton: document.createElement("button"),
    };
    GameToolbarElements.correctAnswers = document.createElement("div");
    GameToolbarElements.correctAnswers.id = "correct-answers";
    GameToolbarElements.correctAnswers.textContent = "Correct Answers: 0";
    GameToolbarElements.correctAnswers.classList.add("score-item");
    domElements.gameToolbar?.appendChild(GameToolbarElements.correctAnswers);

    GameToolbarElements.incorrectAnswers = document.createElement("div");
    GameToolbarElements.incorrectAnswers.id = "incorrect-answers";
    GameToolbarElements.incorrectAnswers.textContent = "Incorrect Answers: 0";
    domElements.gameToolbar?.appendChild(GameToolbarElements.incorrectAnswers);

    GameToolbarElements.timer = document.createElement("div");
    GameToolbarElements.timer.id = "timer";
    GameToolbarElements.timer.textContent = "Time: 0";
    domElements.gameToolbar?.appendChild(GameToolbarElements.timer);

    GameToolbarElements.returnButton = document.createElement("button");
    GameToolbarElements.returnButton.id = "return-button";
    GameToolbarElements.returnButton.textContent = "Return";
    GameToolbarElements.returnButton.classList.add("return-button");
    GameToolbarElements.returnButton.addEventListener("click", () => {
      this.stopGame();
      domElements.game?.classList.add("hidden");
      domElements.menu?.classList.remove("hidden");
    });
    domElements.gameToolbar?.appendChild(GameToolbarElements.returnButton);
    domElements.gameToolbar?.classList.remove("hidden");
    return GameToolbarElements;
  }

  private updateToolbar() {
    this.GameToolbarElements.correctAnswers.textContent = `Correct Answers: ${this.gameState.correctMatches}`;
    this.GameToolbarElements.incorrectAnswers.textContent = `Incorrect Answers: ${this.gameState.incorrectMatches}`;
    this.GameToolbarElements.timer.textContent = `Time: ${this.gameState.elapsedTime}`;
  }

  private setupGameBoard(rowNumber: number): GameBoardElements {
    if (domElements.gameBoard) {
      domElements.gameBoard.innerHTML = "";
    }
    const gameBoardElements = {
      leftColumn: document.createElement("div"),
      rightColumn: document.createElement("div"),
    };
    gameBoardElements.leftColumn = document.createElement("div");
    gameBoardElements.leftColumn.classList.add("column");

    gameBoardElements.rightColumn = document.createElement("div");
    gameBoardElements.rightColumn.classList.add("column");

    for (let i = 0; i < rowNumber; i++) {
      const left_button = document.createElement("button");
      left_button.id = `${i}`;
      gameBoardElements.leftColumn.classList.add("button");
      left_button.textContent = this.gameState.leftWords[i];
      gameBoardElements.leftColumn.appendChild(left_button);

      left_button.addEventListener("click", () => {
        const previousBlueButton = gameBoardElements.leftColumn.querySelector(".blue");
        if (previousBlueButton) {
          previousBlueButton.classList.remove("blue");
        }
        left_button.classList.add("blue");

        const rightSelectedButton = gameBoardElements.rightColumn.querySelector(".blue");
        if (rightSelectedButton) {
          this.handleSelection(left_button, rightSelectedButton);
        }
      });

      const right_button = document.createElement("button");
      right_button.id = `${i}`;
      right_button.classList.add("button");
      right_button.textContent = this.gameState.rightWords[i];
      gameBoardElements.rightColumn.appendChild(right_button);

      right_button.addEventListener("click", () => {
        const previousBlueButton = gameBoardElements.rightColumn.querySelector(".blue");
        if (previousBlueButton) {
          previousBlueButton.classList.remove("blue");
        }
        right_button.classList.add("blue");

        const leftSelectedButton = gameBoardElements.leftColumn.querySelector(".blue");
        if (leftSelectedButton) {
          this.handleSelection(leftSelectedButton, right_button);
        }
      });
    }
    domElements.gameBoard?.appendChild(gameBoardElements.leftColumn);
    domElements.gameBoard?.appendChild(gameBoardElements.rightColumn);
    domElements.gameBoard?.classList.remove("hidden");
    return gameBoardElements;
  }

  private updateGameBoard() {
    const hiddenLeftButtons = this.gameBoardElements.leftColumn.querySelectorAll(".hide");
    hiddenLeftButtons.forEach((button) => {
      const newText = this.gameState.leftWords[parseInt(button.id)];
      if (newText !== "") {
        button.classList.remove("hide");
        button.removeAttribute("disabled");
        button.textContent = newText;
      }
    });

    const hiddenRightButtons = this.gameBoardElements.rightColumn.querySelectorAll(".hide");
    hiddenRightButtons.forEach((button) => {
      const newText = this.gameState.rightWords[parseInt(button.id)];
      if (newText !== "") {
        button.classList.remove("hide");
        button.removeAttribute("disabled");
        button.textContent = newText;
      }
    });
  }

  private refreshGameState() {
    this.intervalId = setInterval(() => {
      this.gameState = this.game.getRefreshedState();
      this.updateToolbar();
      this.updateGameBoard();

      if (this.gameState.isGameOver) {
        clearInterval(this.intervalId);
        this.showGameResults();
        console.log("Game over!");
      }
    }, 300);
  }

  private handleSelection(leftButton: Element, rightButton: Element) {
    const isPaired = this.game.wordsPaired(parseInt(leftButton.id), parseInt(rightButton.id));
    const actionClass = isPaired ? "green" : "red";
    const timeoutClass = isPaired ? "hide" : actionClass;

    [leftButton, rightButton].forEach((button) => {
      button.classList.add(actionClass);
      button.classList.remove("blue");
      if (isPaired) button.setAttribute("disabled", "true");
    });

    setTimeout(() => {
      [leftButton, rightButton].forEach((button) => {
        button.classList.remove(actionClass);
        if (isPaired) button.classList.add(timeoutClass);
      });
    }, 500);
  }

  stopGame() {
    clearInterval(this.intervalId);
  }

  showGameResults() {
    const gameStatistics: GameStatistics = this.game.getGameStatistics();
    domElements.gameToolbar?.classList.add("hidden");
    domElements.gameBoard?.classList.add("hidden");
    if (domElements.gameResults) {
      domElements.gameResults.innerHTML = "";
    }

    const headerContainer = document.createElement("div");
    headerContainer.classList.add("score-header");
    generateResultsHeader(headerContainer, gameStatistics);
    domElements.gameResults?.appendChild(headerContainer);

    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-container");
    generateStatsDisplay(statsContainer, gameStatistics);
    domElements.gameResults?.appendChild(statsContainer);

    const mistakeHeader = document.createElement("h2");
    mistakeHeader.textContent = "Your Mistakes:";
    mistakeHeader.className = "mistakes-header";
    domElements.gameResults?.appendChild(mistakeHeader);

    const mistakesText = document.createElement("div");
    mistakesText.classList.add("mistakes-list");
    mistakesText.classList.add("scrollable-content");
    generateMistakesList(mistakesText, gameStatistics.mistakes);
    domElements.gameResults?.appendChild(mistakesText);

    const returnButton = document.createElement("button");
    returnButton.textContent = "Return to Menu";
    returnButton.addEventListener("click", () => {
      domElements.gameResults?.classList.add("hidden");
      domElements.game?.classList.add("hidden");
      domElements.menu?.classList.remove("hidden");
    });
    domElements.gameResults?.appendChild(returnButton);
    domElements.gameResults?.classList.remove("hidden");
  }
}

/**
 * Generates and updates the header section of the game results
 * @param headerContainer - The container element for the header content
 * @param result - Object containing game result data
 * @param title - Optional custom title (defaults to "Game Results")
 */
function generateResultsHeader(
  headerContainer: HTMLElement,
  result: GameStatistics,
  title: string = "Game Results"
): void {
  // Clear existing content
  headerContainer.innerHTML = "";

  // Calculate total questions and percentage
  const totalQuestions = result.correct + result.incorrect;
  const correctPercentage = totalQuestions > 0 ? Math.round((result.correct / totalQuestions) * 100) : 0;

  // Create title
  const titleElement = document.createElement("h1");
  titleElement.textContent = title;

  // Create score badge
  const scoreBadge = document.createElement("div");
  scoreBadge.className = "score-badge";
  scoreBadge.id = "score-badge";
  scoreBadge.textContent = `Score: ${result.correct}/${totalQuestions}`;

  // Create performance message
  const performanceMessage = document.createElement("div");
  performanceMessage.className = "performance-message";
  performanceMessage.id = "performance-message";

  // Set appropriate message based on score percentage
  if (correctPercentage === 100) {
    performanceMessage.textContent = "Perfect score! Amazing work!";
  } else if (correctPercentage >= 80) {
    performanceMessage.textContent = "Excellent job! Keep it up!";
  } else if (correctPercentage >= 60) {
    performanceMessage.textContent = "Good job! You're making progress with German!";
  } else if (correctPercentage >= 40) {
    performanceMessage.textContent = "Nice effort! Keep practicing these words.";
  } else {
    performanceMessage.textContent = "Keep practicing! You'll improve with time.";
  }

  // Append all elements to the header container
  headerContainer.appendChild(titleElement);
  headerContainer.appendChild(scoreBadge);
  headerContainer.appendChild(performanceMessage);
}

/**
 * Generates and updates the game statistics display
 * @param statsContainer - The container element for all stats
 * @param stats - Object containing game statistics
 */
function generateStatsDisplay(statsContainer: HTMLElement, stats: GameStatistics): void {
  // Clear existing content
  statsContainer.innerHTML = "";

  // Calculate total questions and percentage
  const totalQuestions = stats.correct + stats.incorrect;
  const correctPercentage = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0;

  // Define the stats to display
  const statsToDisplay = [
    { label: "Correct Answers:", value: stats.correct.toString() },
    { label: "Incorrect Answers:", value: stats.incorrect.toString() },
    { label: "Correct Percentage:", value: `${correctPercentage}%` },
    { label: "Elapsed Time:", value: `${stats.elapsedTime.toFixed(1)} seconds` },
  ];

  // Create and append each stat item
  statsToDisplay.forEach((item) => {
    const statItem = document.createElement("div");
    statItem.className = "stat-item";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = item.label;

    const valueSpan = document.createElement("span");
    valueSpan.className = "stat-value";
    valueSpan.textContent = item.value;

    statItem.appendChild(labelSpan);
    statItem.appendChild(valueSpan);

    statsContainer.appendChild(statItem);
  });
}

/**
 * Generates mistake list items and appends them to a parent element
 * @param parentElement - The DOM element to append mistake items to
 * @param mistakes - Array of mistake objects
 * @returns The number of mistakes added
 */
function generateMistakesList(parentElement: HTMLElement, mistakes: Mistake[]): void {
  parentElement.innerHTML = "";

  if (mistakes.length === 0) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "empty-mistakes";
    emptyEl.textContent = "No mistakes - perfect score!";
    parentElement.appendChild(emptyEl);
  }

  // Add each mistake as a formatted list item
  mistakes.forEach((mistake) => {
    const mistakeItem = document.createElement("div");
    mistakeItem.className = "mistake-item";

    // Create the formatted mistake text with highlights
    mistakeItem.innerHTML = `• Original: <span class="highlight">${mistake.original}</span>,
                           Wrong: <span class="highlight">${mistake.wrongTranslation}</span>,
                           Correct: <span class="highlight">${mistake.correctTranslation}</span>`;

    parentElement.appendChild(mistakeItem);
  });
}
