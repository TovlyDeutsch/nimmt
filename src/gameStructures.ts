import { FirebaseDbUpdater } from "./useFirebaseRef";

export const NUM_ROWS = 4;
export const CARDS_PER_ROW = 6;
export const STARTING_POINTS = 66;

export interface Card {
  number: Number;
  points: Number;
  selected: Boolean;
}

export type Row = Array<Card>;
export type Board = Array<Row>;
export type Hand = Array<Card>;

export interface Player {
  name: String;
  points: Number;
  hand: Hand;
}

export interface GameData {
  board: Board;
  players: Array<Player>;
  started: boolean;
}

function genArrayOfEmptyArrays(length: number): Board {
  return Array.from({ length }, (_x, _i) => []);
}

export const setUpGame: FirebaseDbUpdater<GameData> = (existingGame) => {
  if (existingGame === null) {
    console.log("setting up game");
    return {
      started: false,
      board: genArrayOfEmptyArrays(NUM_ROWS),
      players: [],
    };
  }

  console.log("already started");
  return undefined;
};

export const addPlayer = (playerName: string) => {
  const playerUpdater: FirebaseDbUpdater<GameData> = (existingGame) => {
    console.log(existingGame);
    console.log(existingGame.players);
    console.log(typeof existingGame);
    console.log("going to add " + playerName);
    if (
      existingGame.players.map((player) => player.name).includes(playerName)
    ) {
      return undefined;
    }
    existingGame.players.push({
      name: playerName,
      hand: [],
      points: STARTING_POINTS,
    });
    return existingGame;
  };
  return playerUpdater;
};
