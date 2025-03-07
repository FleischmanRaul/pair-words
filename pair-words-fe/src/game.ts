import { WordMachine } from "./word-machine";
import { shuffleItems } from "./utils";

type Dictionary = { [key: string]: string };

export type GameState = {
  leftWords: string[];
  rightWords: string[];
  incorrectMatches: number;
  correctMatches: number;
  isGameOver: boolean;
  elapsedTime: number;
};

export type GameStatistics = {
  correct: number;
  incorrect: number;
  elapsedTime: number;
  mistakes: Mistake[];
};

export type Mistake = { original: string; wrongTranslation: string; correctTranslation: string };

export class GamePairNtoN {
  // TODO: stop on time limit

  private wordMachine: WordMachine;
  private targetPairs: number;
  private rows: number;
  private words: Dictionary = {};
  private refreshRate: number;
  // game state
  private leftWords: string[] = [];
  private rightWords: string[] = [];
  private incorrectMatches: number = 0;
  private correctMatches: number = 0;
  private getStateCounter: number = 0;
  // game statistics
  private startTime: number = 0;
  private endTime: number = 0;
  private mistakes: Mistake[] = [];

  constructor(wordMachine: WordMachine, targetPairs: number, rows: number, refreshRate: number = 10) {
    if (targetPairs < 1 || targetPairs > 500) {
      throw new Error("targetPairs must be between 1 and 500.");
    }
    if (rows < 1 || rows > 10) {
      throw new Error("rows must be between 1 and 10.");
    }
    this.wordMachine = wordMachine;
    this.targetPairs = targetPairs;
    this.rows = rows;
    this.refreshRate = refreshRate;
  }

  startGame(): GameState {
    this.startTime = Date.now();
    this.words = this.wordMachine.getWords(this.rows);
    console.log(`Game started with ${this.targetPairs} words to pair.`);
    this.leftWords = shuffleItems(Object.keys(this.words));
    this.rightWords = shuffleItems(Object.values(this.words));
    return {
      leftWords: this.leftWords,
      rightWords: this.rightWords,
      incorrectMatches: 0,
      correctMatches: 0,
      isGameOver: false,
      elapsedTime: 0,
    };
  }

  wordsPaired(leftIndex: number, rightIndex: number): boolean {
    if (leftIndex < 0 || leftIndex >= this.leftWords.length) {
      throw new Error("Left index out of bounds.");
    }
    if (rightIndex < 0 || rightIndex >= this.rightWords.length) {
      throw new Error("Right index out of bounds.");
    }

    const leftWord = this.leftWords[leftIndex];
    if (leftWord === "") {
      return false;
    }
    const rightWord = this.rightWords[rightIndex];
    const isCorrect = this.words[leftWord] === rightWord;

    if (isCorrect) {
      this.correctMatches++;
      this.leftWords[leftIndex] = "";
      this.rightWords[rightIndex] = "";
    } else {
      this.incorrectMatches++;
      this.mistakes.push({ original: leftWord, wrongTranslation: rightWord, correctTranslation: this.words[leftWord] });
    }
    return isCorrect;
  }

  getRefreshedState(): GameState {
    const emptyCount = this.leftWords.filter((word) => word === "").length;
    const currentPairs = this.correctMatches + this.rows - emptyCount;
    if (this.getStateCounter == this.refreshRate && currentPairs < this.targetPairs) {
      this.getStateCounter = 0;
      if (emptyCount > 0) {
        const newPairs = this.wordMachine.getWords(emptyCount);
        const newLeftWords = shuffleItems(Object.keys(newPairs));
        const newRightWords = shuffleItems(Object.values(newPairs));

        let leftIndex = 0;
        let rightIndex = 0;

        this.leftWords = this.leftWords.map((word) => (word === "" ? newLeftWords[leftIndex++] : word));
        this.rightWords = this.rightWords.map((word) => (word === "" ? newRightWords[rightIndex++] : word));

        Object.assign(this.words, newPairs);
      }
    } else {
      this.getStateCounter++;
    }

    const isGameOver = this.correctMatches === this.targetPairs;

    if (isGameOver) {
      this.endTime = Date.now();
    }

    return {
      leftWords: this.leftWords,
      rightWords: this.rightWords,
      incorrectMatches: this.incorrectMatches,
      correctMatches: this.correctMatches,
      isGameOver,
      elapsedTime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  getGameStatistics(): GameStatistics {
    const statistics = {
      correct: this.correctMatches,
      incorrect: this.incorrectMatches,
      elapsedTime: (this.endTime - this.startTime) / 1000,
      mistakes: this.mistakes,
    };
    console.log(`Game ended in ${statistics.elapsedTime} seconds.`);
    console.log(`Correct: ${statistics.correct}, Incorrect: ${statistics.incorrect}`);
    console.log("Mistakes:");
    console.log(statistics.mistakes);
    return statistics;
  }
}
