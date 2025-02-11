import { describe, it, expect, beforeEach } from "vitest";
import { WordMachine } from "./word-machine";
import { GamePairNtoN } from "./game";

describe("GamePairNtoN", () => {
  let wordMachine: WordMachine;
  let game: GamePairNtoN;
  const maxIterations = 10000;

  beforeEach(() => {
    wordMachine = new WordMachine(true, false, false, false, false, false, false, false, false);
  });

  it("should initialize the game correctly", () => {
    game = new GamePairNtoN(wordMachine, 15, 3);
    const gameState = game.startGame();
    expect(gameState.leftWords.length).toBe(3);
    expect(gameState.rightWords.length).toBe(3);
    expect(gameState.incorrectMatches).toBe(0);
    expect(gameState.correctMatches).toBe(0);
    expect(gameState.isCorrect).toBe(false);
    expect(gameState.isGameOver).toBe(false);
  });

  it("1 row game", () => {
    game = new GamePairNtoN(wordMachine, 5, 1);
    let gameState = game.startGame();
    let iterations = 0;
    while (gameState.isGameOver === false && iterations < maxIterations) {
      iterations++;
      gameState = game.wordsPaired(gameState.leftWords[0], gameState.rightWords[0]);
    }
    expect(gameState.incorrectMatches).toBe(0);
    expect(gameState.correctMatches).toBe(5);
    expect(gameState.isGameOver).toBe(true);
  });

  it("3 rows game with random pairing", () => {
    game = new GamePairNtoN(wordMachine, 50, 3);
    let gameState = game.startGame();
    let incorrectGuesses = 0;
    let iterations = 0;
    while (gameState.isGameOver === false && iterations < maxIterations) {
      iterations++;
      const leftIndex = Math.floor(Math.random() * gameState.leftWords.length);
      const rightIndex = Math.floor(Math.random() * gameState.rightWords.length);
      gameState = game.wordsPaired(gameState.leftWords[leftIndex], gameState.rightWords[rightIndex]);
      if (gameState.isCorrect === false) {
        incorrectGuesses++;
      }
    }
    expect(gameState.incorrectMatches).toBe(incorrectGuesses);
    expect(gameState.correctMatches).toBe(50);
    expect(gameState.isGameOver).toBe(true);
  });
});
