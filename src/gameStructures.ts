import { FirebaseDbUpdater } from "./useFirebaseRef";

export const NUM_ROWS = 4;
export const CARDS_PER_ROW = 6;
export const STARTING_POINTS = 66;
export const CARDS_PER_DECK = 104;
export const CARDS_PER_HAND = 10;

export enum CardState {
  readyToPlay,
  waitingOnPlayer,
  onBoard,
  inHand,
  inDeck,
  playingAnimation,
}

export interface Card {
  number: number;
  points: number;
  selected: Boolean;
  cardState: CardState;
}

export interface PlayedCard extends Card {
  playerName: string;
}

export type Row = Array<Card>;
export type Board = Array<Row>;
export type Hand = Array<Card>;
export type Deck = Array<Card>;

export interface Player {
  name: string;
  points: number;
  hand: Hand;
}

export interface GameData {
  board: Board;
  deck: Deck;
  // TODO index this by player name
  players: Array<Player>;
  cardsToPlay: Array<PlayedCard>;
  started: boolean;
}

function genCard(number: number, cardState: CardState): Card {
  // TODO figure out how to determine points
  let points = 1;
  if (number === 55) {
    points = 7;
  } else if (number % 11 === 0) {
    points = 5;
  } else if (number % 10 === 0) {
    points = 3;
  } else if (number % 5 === 0) {
    points = 2;
  }

  return { number: number, points: points, selected: false, cardState };
}

function genDeck() {
  return Array.from({ length: CARDS_PER_DECK }, (_x, i) =>
    genCard(i, CardState.inDeck)
  );
}

function genDeckFromNumbers(numbers: number[]): Deck {
  return numbers.map((number) => genCard(number, CardState.inDeck));
}

function genListOfNumbers() {
  return Array.from({ length: CARDS_PER_DECK }, (_x, i) => i);
}

function reshuffleDiscard(gameData: GameData) {
  const cardsOut = new Set();
  for (const player of gameData.players) {
    player.hand.forEach((card) => cardsOut.add(card));
  }
  for (const row of gameData.board) {
    row.forEach((card) => cardsOut.add(card));
  }
  const allCards = new Set(genListOfNumbers());

  let intersection = new Set([...allCards].filter((x) => cardsOut.has(x)));

  gameData.deck = genDeckFromNumbers(Array.from(intersection));

  // TODO
}

function getRandomCard(gameData: GameData): Card {
  if (gameData.deck.length <= 0) {
    reshuffleDiscard(gameData);
  }
  const cardIndex = Math.floor(Math.random() * gameData.deck.length);
  const card = gameData.deck[cardIndex];
  gameData.deck.splice(cardIndex, 1);
  return card;
}

function getFreshRow(gameData: GameData): Row {
  const card = getRandomCard(gameData);
  return [card];
}

function getDealedBoard(gameData: GameData): Board {
  let board: Board = [];
  for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
    const row = getFreshRow(gameData);
    board.push(row);
  }
  return board;
}

function dealHandToPlayer(gameData: GameData, player: Player) {
  if (player.hand.length !== 0) {
    throw new Error("Cannot deal new hand to player with cards in their hand");
  }
  let newHand: Hand = [];
  for (let handIndex = 0; handIndex < CARDS_PER_HAND; handIndex++) {
    const card = getRandomCard(gameData);
    newHand.push(card);
  }
  player.hand = newHand;
}

function dealPlayers(gameData: GameData, players: Array<Player>) {
  for (const player of players) {
    dealHandToPlayer(gameData, player);
  }
}

export const setUpGame: FirebaseDbUpdater<GameData> = (existingGame) => {
  if (existingGame === null) {
    console.log("settting up game");
    return {
      started: false,
      board: [],
      deck: [],
      players: [],
      cardsToPlay: [],
    };
  }

  console.log("already set up");
  return undefined;
};

const startNewRound = (gameData: GameData) => {
  gameData.board = getDealedBoard(gameData);
  dealPlayers(gameData, gameData.players);
};

export const startGame: FirebaseDbUpdater<GameData> = (existingGame) => {
  if (existingGame.started) {
    console.log("already started");
    return undefined;
  }

  console.log("starting up game");
  existingGame.deck = genDeck();
  startNewRound(existingGame);
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

function getCardToPlayForPlayer(player: Player): PlayedCard | null {
  const cardToPlay = player.hand.find((card) => card.selected) ?? null;
  if (cardToPlay === null) {
    return null;
  }
  return { ...cardToPlay, playerName: player.name };
}

function getCardsToPlay(players: Array<Player>): Array<PlayedCard> {
  return players.flatMap((player) => {
    const playedCard = getCardToPlayForPlayer(player);
    return playedCard === null ? [] : [playedCard];
  });
}

function getPlayerByName(players: Array<Player>, name: string) {
  const player = players.find((player) => player.name === name);
  if (!player) {
    throw new Error(`player ${name} not found`);
  }
  return player;
}

function insertIntoCardsToPlayIfAllPlayersSelected(
  gameData: GameData
): GameData {
  const cardsToPlay: Array<PlayedCard> = getCardsToPlay(gameData.players);
  if (cardsToPlay.length !== gameData.players.length) {
    // if any player hasn't selected a card, don't do anything
    return gameData;
  }
  cardsToPlay.forEach((card) => (card.selected = false));
  cardsToPlay.sort(
    (playedCard1, playedCard2) => playedCard1.number - playedCard2.number
  );

  for (const selectedCard of cardsToPlay) {
    const player = getPlayerByName(gameData.players, selectedCard.playerName);
    player.hand.splice(
      player.hand.findIndex((card) => card.number === selectedCard.number),
      1
    );
  }
  gameData.cardsToPlay = cardsToPlay;

  return gameData;
}

export const selectCardForPlayer = (playerName: string, cardNumber: number) => {
  const playerUpdater: FirebaseDbUpdater<GameData> = (gameData) => {
    console.log(`selecting card ${cardNumber} for player ${playerName}`);
    const hand = gameData.players.find((player) => player.name === playerName)
      ?.hand;
    if (!hand) {
      throw new Error(`Can't select card for missing palyer ${playerName}`);
    }
    hand.forEach((card) => {
      console.log(
        `setting card ${card.number} selected to ${card.number === cardNumber}`
      );
      card.selected = card.number === cardNumber;
    });
    gameData = insertIntoCardsToPlayIfAllPlayersSelected(gameData);
    return gameData;
  };
  return playerUpdater;
};

const deductRowForPlayer = (player: Player, row: Row) => {
  const totalPoints = row.reduce((total, card) => total + card.points, 0);
  player.points -= totalPoints;
};

export const processNextCardToPlay: FirebaseDbUpdater<GameData> = (
  gameData
) => {
  if (gameData.cardsToPlay.length === 0) {
    return undefined;
  }
  const cardToPlayIndex = gameData.cardsToPlay.findIndex(
    (card) =>
      card.cardState !== CardState.onBoard &&
      card.cardState !== CardState.playingAnimation
  );
  console.log(`card to play index: ${cardToPlayIndex}`);
  // wait for animation to finish
  if (
    cardToPlayIndex > 0 &&
    gameData.cardsToPlay[cardToPlayIndex - 1].cardState ===
      CardState.playingAnimation
  ) {
    console.log(`stopping early b/c previous card is animating`);
    return undefined;
  }
  console.log("got past stopping early");

  if (
    gameData.cardsToPlay.every((card) => card.cardState === CardState.onBoard)
  ) {
    gameData.cardsToPlay = [];
    return gameData;
  }
  if (cardToPlayIndex === -1) {
    return undefined;
  }
  const cardToPlay = gameData.cardsToPlay[cardToPlayIndex];
  if (
    cardToPlay.cardState === CardState.readyToPlay ||
    cardToPlay.cardState === CardState.waitingOnPlayer
  ) {
    return undefined;
  }

  let rowIndex = null;
  let minDifference = Infinity;
  for (const [i, row] of gameData.board.entries()) {
    const difference = cardToPlay.number - row[row.length - 1].number;
    if (difference > 0 && difference < minDifference) {
      minDifference = difference;
      rowIndex = i;
    }
  }
  if (rowIndex === null) {
    console.log("card waiting on player");
    gameData.cardsToPlay[cardToPlayIndex].cardState = CardState.waitingOnPlayer;
    return gameData;
  }

  // const row = gameData.board[rowIndex];
  // gameData.board[rowIndex][row.length - 1].cardState = CardState.readyToPlay;
  playCardInRow(rowIndex, false)(gameData);

  return gameData;
};

export const playCardInRow = (rowIndex: number, clear: boolean) => {
  const playCardInRow: FirebaseDbUpdater<GameData> = (gameData) => {
    const cardToPlayIndex = gameData.cardsToPlay.findIndex(
      (card) =>
        card.cardState !== CardState.onBoard &&
        card.cardState !== CardState.playingAnimation
    );
    if (cardToPlayIndex === -1) {
      return undefined;
    }
    const cardToPlay = gameData.cardsToPlay[cardToPlayIndex];
    if (gameData.board[rowIndex].length === 5 || clear) {
      const player = getPlayerByName(gameData.players, cardToPlay.playerName);
      deductRowForPlayer(player, gameData.board[rowIndex]);
      gameData.board[rowIndex] = [];
    }
    cardToPlay.cardState = CardState.playingAnimation;
    gameData.board[rowIndex].push(cardToPlay);
    // gameData.cardsToPlay.shift();
    cardToPlay.selected = false;
    // cardToPlay.cardState = CardState.onBoard;
    return gameData;
  };
  return playCardInRow;
};

export const markCardInBoard = (cardToPlayIndex: number) => {
  const markCardInBoard: FirebaseDbUpdater<GameData> = (gameData) => {
    console.log("mark in board");
    if (gameData.cardsToPlay[cardToPlayIndex] === undefined) {
      return undefined;
    }
    gameData.cardsToPlay[cardToPlayIndex].cardState = CardState.onBoard;
    return gameData;
  };
  return markCardInBoard;
};

export const checkEnd = (players: Array<Player>) => {
  return players.find((player) => player.points <= 0) !== undefined;
};

export const isGameOver = (gameData: GameData) => {
  return (
    checkEnd(gameData.players) &&
    gameData.players.length > 0 &&
    gameData.players[0].hand.length !== 0
  );
};

export const checkEndAndstartNewRoundIfNeccessary: FirebaseDbUpdater<GameData> = (
  gameData
) => {
  if (
    checkEnd(gameData.players) ||
    gameData.players.length === 0 ||
    gameData.players[0].hand.length !== 0
  ) {
    return undefined;
  }
  startNewRound(gameData);
  return gameData;
};
