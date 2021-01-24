import { FirebaseDbUpdater } from "./useFirebaseRef";

export const NUM_ROWS = 4;
export const CARDS_PER_ROW = 6;
export const STARTING_POINTS = 66;
export const CARDS_PER_DECK = 104;
export const CARDS_PER_HAND = 10;

export interface Card {
  number: number;
  points: number;
  selected: Boolean;
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

function genCard(number: number): Card {
  // TODO figure out how to determine points
  return { number: number, points: 1, selected: false };
}

function genDeck() {
  return Array.from({ length: CARDS_PER_DECK }, (_x, i) => genCard(i));
}

function getRandomCard(deck: Deck): Card {
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck[cardIndex];
  deck.splice(cardIndex, 1);
  return card;
}

function getFreshRow(deck: Deck): Row {
  const card = getRandomCard(deck);
  return [card];
}

function getDealedBoard(deck: Deck): Board {
  let board: Board = [];
  for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
    const row = getFreshRow(deck);
    board.push(row);
  }
  return board;
}

function dealHandToPlayer(deck: Deck, player: Player) {
  if (player.hand.length !== 0) {
    throw new Error("Cannot deal new hand to player with cards in their hand");
  }
  let newHand: Hand = [];
  for (let handIndex = 0; handIndex < CARDS_PER_HAND; handIndex++) {
    const card = getRandomCard(deck);
    newHand.push(card);
  }
  player.hand = newHand;
}

function dealPlayers(deck: Deck, players: Array<Player>) {
  for (const player of players) {
    dealHandToPlayer(deck, player);
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
  gameData.board = getDealedBoard(gameData.deck);
  dealPlayers(gameData.deck, gameData.players);
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
  cardsToPlay.sort((playedCard) => playedCard.number);

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

export const processCardsToPlay: FirebaseDbUpdater<GameData> = (gameData) => {
  if (gameData.cardsToPlay.length === 0) {
    return undefined;
  }
  const cardToPlay = gameData.cardsToPlay[0];
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
    return undefined;
  }

  if (gameData.board[rowIndex].length === 5) {
    const player = getPlayerByName(gameData.players, cardToPlay.playerName);
    deductRowForPlayer(player, gameData.board[rowIndex]);
    gameData.board[rowIndex] = [];
  } else {
    gameData.board[rowIndex].push(cardToPlay);
  }
  gameData.cardsToPlay.shift();
  cardToPlay.selected = false;
  return gameData;
};

export const checkEnd = (players: Array<Player>) => {
  return players.find((player) => player.points <= 0) !== undefined;
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
