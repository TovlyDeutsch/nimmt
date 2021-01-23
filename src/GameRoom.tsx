import React, { useState } from "react";
import { useFirebaseRef } from "./useFirebaseRef";
import {
  GameData,
  Board as BoardType,
  setUpGame,
  addPlayer,
  CARDS_PER_ROW,
  Row as RowType,
  Card as CardType,
  Hand as HandType,
} from "./gameStructures";
import JoinGame from "./JoinGame";
import { assert } from "console";

type GameRoomProps = {
  gameData: GameData | null;
  name: string;
};
type BoardProps = {
  board: BoardType;
};
type RowProps = {
  row: RowType;
};
type CardProps = {
  card: CardType;
};
type HandProps = {
  hand: HandType;
};

function Card({ card }: CardProps) {
  return <div className="card">{card.number}</div>;
}
function EmptyCard() {
  return <div className="card emptyCard"></div>;
}
function Row({ row }: RowProps) {
  let rowOfCards = row.map((card) => <Card card={card} />);
  console.log(`row length before push ${rowOfCards.length}`);
  for (let i = row.length; i < CARDS_PER_ROW; i++) {
    rowOfCards.push(<EmptyCard />);
  }
  console.log(`row length after push ${rowOfCards.length}`);
  return <div className="row">{rowOfCards}</div>;
}

function Board({ board }: BoardProps) {
  return (
    <div className="board">
      {board.map((row) => (
        <Row row={row} />
      ))}
    </div>
  );
}
function Hand({ hand }: HandProps) {
  return (
    <div className="hand">
      {hand.map((card) => (
        <Card card={card} />
      ))}
    </div>
  );
}

// function H

function GameRoom({ gameData, name }: GameRoomProps) {
  if (gameData === null) {
    console.log("no game data");
    return null;
  }

  const hand = gameData.players.find((player) => player.name === name)?.hand;
  if (!hand) {
    console.log("missing hand");
    return null;
  }

  return (
    <div className="handAndBoard">
      <Hand hand={hand} />
      <Board board={gameData.board} />
    </div>
  );
}

export default GameRoom;
