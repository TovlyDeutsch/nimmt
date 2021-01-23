import { FirebaseDbUpdater } from "./useFirebaseRef";

export const NUM_ROWS = 4;
export const CARDS_PER_ROW = 6;
export const STARTING_POINTS = 66;
export const CARDS_PER_DECK = 104;

export interface Card {
  number: Number;
  points: Number;
  selected: Boolean;
}

export type Row = Array<Card>;
export type Board = Array<Row>;
export type Hand = Array<Card>;
export type Deck = Array<Card>;

export interface Player {
  name: String;
  points: Number;
  hand: Hand;
}

export interface GameData {
  board: Board;
  deck: Deck;
  players: Array<Player>;
  started: boolean;
}

function genArrayOfEmptyArrays(length: number): Board {
  return Array.from({ length }, (_x, _i) => []);
}

function genCard(number: number): Card {
  // TODO figure out how to determine points
  return { number: number, points: 1, selected: false };
}

function genDeck() {
  return Array.from({ length: CARDS_PER_DECK }, (_x, i) => genCard(i));
}

function getRandomCard(deck: Deck): [Deck, Card] {
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck[cardIndex];
  deck.splice(cardIndex, 1);
  return [deck, card];
}

function getFreshRow(deck: Deck): [Deck, Row] {
  const [newDeck, card] = getRandomCard(deck);
  return [newDeck, [card]];
}

function getDealedBoard(deck: Deck): [Deck, Board] {
  let board: Board = [];
  for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
    let row;
    [deck, row] = getFreshRow(deck);
    board.push(row);
  }
  return [deck, board];
}

export const setUpGame: FirebaseDbUpdater<GameData> = (existingGame) => {
  if (existingGame === null) {
    console.log("settting up game");
    return {
      started: false,
      board: [],
      deck: [],
      players: [],
    };
  }

  console.log("already set up");
  return undefined;
};

export const startGame: FirebaseDbUpdater<GameData> = (existingGame) => {
  if (existingGame.started) {
    console.log("already started");
    return undefined;
  }

  console.log("starting up game");
  let deck = genDeck();
  let board;
  [deck, board] = getDealedBoard(deck);
  existingGame.deck = deck;
  existingGame.board = board;
  existingGame.started = true;
  return existingGame;
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
