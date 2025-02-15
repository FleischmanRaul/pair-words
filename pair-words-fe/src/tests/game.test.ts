import { describe, it, expect, beforeEach } from "vitest";
import { WordMachine } from "../word-machine";
import { GamePairNtoN } from "../game";

describe("GamePairNtoN", () => {
  let wordMachine: WordMachine;
  let game: GamePairNtoN;
  const maxIterations = 10000;

  beforeEach(() => {
    wordMachine = new WordMachine(["adjectives"]);
  });

  it("should initialize the game correctly", () => {
    game = new GamePairNtoN(wordMachine, 15, 3);
    const gameState = game.startGame();
    expect(gameState.leftWords.length).toBe(3);
    expect(gameState.rightWords.length).toBe(3);
    expect(gameState.incorrectMatches).toBe(0);
    expect(gameState.correctMatches).toBe(0);
    expect(gameState.isGameOver).toBe(false);
  });

  it("1 row game", () => {
    game = new GamePairNtoN(wordMachine, 5, 1);
    let gameState = game.startGame();
    let iterations = 0;
    while (gameState.isGameOver === false && iterations < maxIterations) {
      iterations++;
      const isCorrect = game.wordsPaired(0, 0);
      expect(isCorrect === true);
      gameState = game.getRefreshedState();
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
      const isCorrect = game.wordsPaired(leftIndex, rightIndex);
      if (isCorrect === false) {
        incorrectGuesses++;
      }
      gameState = game.getRefreshedState();
    }
    expect(gameState.incorrectMatches).toBe(incorrectGuesses);
    expect(gameState.correctMatches).toBe(50);
    expect(gameState.isGameOver).toBe(true);
  });
});
