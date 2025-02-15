import { GamePairNtoN, GameState } from "./game";
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

export class gameUI {
  private game: GamePairNtoN;
  private gameState: GameState;
  private gameBoardElements: GameBoardElements;
  private GameToolbarElements: GameToolbarElements;
  private intervalId: number = 0;

  constructor(selectedCategories: string[], pairTarget: number, rowNumber: number) {
    const wordMachine = new WordMachine(selectedCategories);
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
    GameToolbarElements.returnButton.addEventListener("click", () => {
      this.stopGame();
      domElements.game?.classList.add("hidden");
      domElements.menu?.classList.remove("hidden");
    });
    domElements.gameToolbar?.appendChild(GameToolbarElements.returnButton);
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
        console.log("Game over!");
      }
    }, 300);
  }

  private handleSelection(leftButton: Element, rightButton: Element) {
    console.log(`Pair selected: ${leftButton.id} and ${rightButton.id}`);
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
}
