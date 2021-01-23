import React, { useState } from "react";
import { useFirebaseRef } from "./useFirebaseRef";
import {
  GameData,
  Board,
  setUpGame,
  addPlayer,
  CARDS_PER_ROW,
  Row,
  Card,
} from "./gameStructures";
import JoinGame from "./JoinGame";

type GameRoomProps = {
  gameData: GameData | null;
};
type BoardProps = {
  board: Board;
};
type RowProps = {
  row: Row;
};
type CardProps = {
  card: Card;
};

function CardComponent({ card }: CardProps) {
  return <div className="card">{card.number}</div>;
}
function EmptyCard() {
  return <div className="card emptyCard"></div>;
}
function RowComponent({ row }: RowProps) {
  let rowOfCards = row.map((card) => <CardComponent card={card} />);
  console.log(`row length before push ${rowOfCards.length}`);
  for (let i = row.length; i < CARDS_PER_ROW; i++) {
    rowOfCards.push(<EmptyCard />);
  }
  console.log(`row length after push ${rowOfCards.length}`);
  return <div className="row">{rowOfCards}</div>;
}

function BoardComponent({ board }: BoardProps) {
  return (
    <div className="board">
      {board.map((row) => (
        <RowComponent row={row} />
      ))}
    </div>
  );
}

function GameRoom({ gameData }: GameRoomProps) {
  return (
    <div>{gameData !== null && <BoardComponent board={gameData.board} />}</div>
  );
}

export default GameRoom;
