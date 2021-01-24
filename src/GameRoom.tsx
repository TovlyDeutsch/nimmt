import { Button } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import {
  Board as BoardType,
  Card as CardType,
  CardState,
  CARDS_PER_ROW,
  GameData,
  Hand as HandType,
  PlayedCard,
  Row as RowType,
} from "./gameStructures";

type GameRoomProps = {
  gameData: GameData | null;
  name: string;
  onCardClick?: (card: CardType) => void;
  onSelectRow: (rowIndex: number) => void;
};
type BoardProps = {
  board: BoardType;
  cardsToPlay: Array<PlayedCard>;
  onSelectRow: (rowIndex: number) => void;
  playerName: string;
};
type RowProps = {
  row: RowType;
  onSelectRow: () => void;
  selectable: boolean;
};
type CardProps = {
  card: CardType;
  onCardClick?: (card: CardType) => void;
};
type HandProps = {
  hand: HandType;
  disabled: boolean;
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
function Row({ row, onSelectRow, selectable }: RowProps) {
  let rowOfCards = row.map((card, i) => <Card card={card} key={i} />);
  console.log(`row length before push ${rowOfCards.length}`);
  for (let i = row.length; i < CARDS_PER_ROW; i++) {
    rowOfCards.push(<EmptyCard key={i} />);
  }
  if (selectable) {
    rowOfCards.push(
      <Button
        onClick={(e) => {
          onSelectRow();
        }}
        color="primary"
        variant="contained"
      >
        Select row
      </Button>
    );
  }
  console.log(`row length after push ${rowOfCards.length}`);
  return <div className="row">{rowOfCards}</div>;
}

function Board({ board, cardsToPlay, onSelectRow, playerName }: BoardProps) {
  // TODO check cardsToPlay for and show pips to click clear row
  let selectableRows = false;
  if (
    cardsToPlay.length > 0 &&
    cardsToPlay[0].playerName &&
    cardsToPlay[0].cardState === CardState.waitingOnPlayer
  ) {
    selectableRows = true;
  }

  return (
    <div className="board">
      {board.map((row, i) => (
        // TODO add animation before
        <Row
          row={row}
          key={i}
          onSelectRow={() => onSelectRow(i)}
          selectable={selectableRows}
        />
      ))}
    </div>
  );
}
function Hand({ hand, onCardClick, disabled }: HandProps) {
  return (
    <>
      <h2>Your hand:</h2>
      <div className="hand row">
        {hand.map((card, i) => (
          <Card
            card={card}
            key={i}
            onCardClick={disabled ? () => {} : onCardClick}
          />
        ))}
      </div>
    </>
  );
}

// function H

function GameRoom({ gameData, name, onCardClick, onSelectRow }: GameRoomProps) {
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
    <div className="gameRoom">
      <Hand
        hand={hand}
        onCardClick={onCardClick}
        disabled={gameData.cardsToPlay.length !== 0}
      />
      <Board
        board={gameData.board}
        cardsToPlay={gameData.cardsToPlay}
        onSelectRow={onSelectRow}
        playerName={name}
      />
    </div>
  );
}

export default GameRoom;
