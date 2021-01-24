import classnames from "classnames";
import React from "react";
import {
  Board as BoardType,
  Card as CardType,
  CARDS_PER_ROW,
  GameData,
  Hand as HandType,
  Row as RowType,
} from "./gameStructures";

type GameRoomProps = {
  gameData: GameData | null;
  name: string;
  onCardClick?: (card: CardType) => void;
};
type BoardProps = {
  board: BoardType;
};
type RowProps = {
  row: RowType;
};
type CardProps = {
  card: CardType;
  onCardClick?: (card: CardType) => void;
};
type HandProps = {
  hand: HandType;
  onCardClick?: (card: CardType) => void;
};

function Card({ card, onCardClick = (card: CardType) => {} }: CardProps) {
  return (
    <div
      onClick={() => onCardClick(card)}
      className={classnames({
        card: true,
        selectedCard: card.selected,
      })}
    >
      {card.number}
    </div>
  );
}
function EmptyCard() {
  return <div className="card emptyCard"></div>;
}
function Row({ row }: RowProps) {
  let rowOfCards = row.map((card, i) => <Card card={card} key={i} />);
  console.log(`row length before push ${rowOfCards.length}`);
  for (let i = row.length; i < CARDS_PER_ROW; i++) {
    rowOfCards.push(<EmptyCard key={i} />);
  }
  console.log(`row length after push ${rowOfCards.length}`);
  return <div className="row">{rowOfCards}</div>;
}

function Board({ board }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, i) => (
        <Row row={row} key={i} />
      ))}
    </div>
  );
}
function Hand({ hand, onCardClick }: HandProps) {
  return (
    <>
      <h2>Your hand:</h2>
      <div className="hand row">
        {hand.map((card, i) => (
          // TODO disable selection during animation (when their are cards in cardsToPlay)
          <Card card={card} key={i} onCardClick={onCardClick} />
        ))}
      </div>
    </>
  );
}

// function H

function GameRoom({ gameData, name, onCardClick }: GameRoomProps) {
  if (gameData === null) {
    console.log("no game data");
    return null;
  }

  const hand = gameData.players.find((player) => player.name === name)?.hand;
  if (!hand) {
    console.log("missing hand");
    return null;
  }

  // TODO check cardsToPlay for and show pips to click clear row

  return (
    <div className="gameRoom">
      <Hand hand={hand} onCardClick={onCardClick} />
      <Board board={gameData.board} />
    </div>
  );
}

export default GameRoom;
