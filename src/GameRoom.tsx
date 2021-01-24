import { Button } from "@material-ui/core";
import classnames from "classnames";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  getCardToPlayBoundingBox: (cardNumber: number) => ClientRect;
};
type RowProps = {
  row: RowType;
  onSelectRow: () => void;
  selectable: boolean;
  cardToAnimate: [number, ClientRect] | undefined;
};
type CardProps = {
  card: CardType;
  onCardClick?: (card: CardType) => void;
  setBoundingBoxForCardToPlay?: (
    cardNumber: number,
    boundingBox: ClientRect | null
  ) => void;
  animateFromBoundingBox?: ClientRect;
};
type HandProps = {
  hand: HandType;
  disabled: boolean;
  onCardClick?: (card: CardType) => void;
};
type CardsToPlayProps = {
  cardsToPlay: Array<PlayedCard>;
  setBoundingBoxForCardToPlay: (
    cardNumber: number,
    boundingBox: ClientRect | null
  ) => void;
};

function animateElement(
  domNode: HTMLElement | null,
  newBoundingBox: ClientRect
) {
  if (domNode === null) {
    return;
  }
  const currentBox = domNode.getBoundingClientRect();
  const changeInX = newBoundingBox.left - currentBox.left;
  const changeInY = newBoundingBox.top - currentBox.top;
  console.log(`change x ${changeInX}`);
  requestAnimationFrame(() => {
    // Before the DOM paints, invert child to old position
    domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
    domNode.style.transition = "transform 0s";
    requestAnimationFrame(() => {
      // After the previous frame, remove
      // the transistion to play the animation
      domNode.style.transform = "";
      domNode.style.transition = "transform 5000ms";
    });
  });
}

function Card({
  card,
  onCardClick = (card: CardType) => {},
  setBoundingBoxForCardToPlay = (
    cardNumber: number,
    boundingBox: ClientRect | null
  ) => {},
  animateFromBoundingBox,
}: CardProps) {
  const measuredPosition = useRef(false);
  const cardDivRef = useRef<HTMLDivElement | null>(null);
  const animated = useRef(false);

  // const measuredRef = useCallback((node) => {
  //   if (node !== null) {
  //     console.log(`calling for set bbox for ${card.number}`);
  //     console.log(`node ${node}`);
  //     console.log(`node ${node.getBoundingClientRect()}`);
  //     setBoundingBoxForCardToPlay(card.number, node.getBoundingClientRect());
  //   }
  // }, []);

  useLayoutEffect(() => {
    console.log(`animatefrom bounding ${animateFromBoundingBox}`);
    console.log(`current el ${cardDivRef.current}`);
    if (
      cardDivRef.current &&
      animated.current === false &&
      animateFromBoundingBox
    ) {
      console.log("going to animate");
      animateElement(cardDivRef.current, animateFromBoundingBox);
      animated.current = true;
      setBoundingBoxForCardToPlay(card.number, null);
    } else if (measuredPosition.current === false) {
      if (cardDivRef === null) {
        return;
      }
      console.log(`calling for set bbox for ${card.number}`);
      console.log(`node ${cardDivRef}`);
      console.log(`node bbox ${cardDivRef.current!.getBoundingClientRect()}`);
      measuredPosition.current = true;
      setBoundingBoxForCardToPlay(
        card.number,
        cardDivRef.current!.getBoundingClientRect()
      );
    }
  }, [
    card,
    cardDivRef,
    animateFromBoundingBox,
    setBoundingBoxForCardToPlay,
    animated,
  ]);

  // const measuredRef = useCallback(
  //   (node) => {
  //     if (node !== null && measuredPosition.current === false) {
  //       console.log(`calling for set bbox for ${card.number}`);
  //       console.log(`node ${node}`);
  //       console.log(`node bbox ${node.getBoundingClientRect()}`);
  //       measuredPosition.current = true;
  //       setBoundingBoxForCardToPlay(card.number, node.getBoundingClientRect());
  //     }
  //   },
  //   [card, setBoundingBoxForCardToPlay, measuredPosition]
  // );

  return (
    <div
      ref={cardDivRef}
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
function Row({ row, onSelectRow, selectable, cardToAnimate }: RowProps) {
  console.log(cardToAnimate);
  let rowOfCards = row.map((card, i) => {
    console.log(`rendering card ${card.number}`);
    console.log(
      cardToAnimate && cardToAnimate[0] === card.number,
      cardToAnimate
    );
    return (
      <Card
        card={card}
        key={i}
        animateFromBoundingBox={
          cardToAnimate && cardToAnimate[0] === card.number
            ? cardToAnimate[1]
            : undefined
        }
      />
    );
  });
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

// const calculateBoundingBoxes = (children: React.ReactElement) => {
//   const boundingBoxes = {};

//   React.Children.forEach(children, child => {
//     const domNode = child.ref.current;
//     const nodeBoundingBox = domNode.getBoundingClientRect();

//     boundingBoxes[child.key] = nodeBoundingBox;
//   });

//   return boundingBoxes;
// };

function usePrevious(value: any): any | undefined {
  const ref = useRef();
  useEffect(() => {
    ref.current = JSON.parse(JSON.stringify(value));
  });
  return ref.current;
}

function Board({
  board,
  cardsToPlay,
  onSelectRow,
  playerName,
  getCardToPlayBoundingBox,
}: BoardProps) {
  const prevBoard = usePrevious(board);
  const prevCardsToPlay = usePrevious(cardsToPlay);

  let selectableRows = false;
  if (
    cardsToPlay.length > 0 &&
    cardsToPlay[0].playerName &&
    cardsToPlay[0].cardState === CardState.waitingOnPlayer
  ) {
    selectableRows = true;
  }

  let cardToAnimate: [number, ClientRect] | undefined;
  if (prevBoard !== board) {
    console.log("new board");
    if (prevCardsToPlay?.length > 0) {
      const playedCard = prevCardsToPlay[0];
      cardToAnimate = [
        playedCard.number,
        getCardToPlayBoundingBox(playedCard.number),
      ];
    }
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
          cardToAnimate={cardToAnimate}
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

function CardsToPlay({
  cardsToPlay,
  setBoundingBoxForCardToPlay,
}: CardsToPlayProps) {
  return (
    <div className="cardsToPlay">
      {cardsToPlay.map((card, i) => (
        <div>
          <h2>{card.playerName}</h2>
          <Card
            card={card}
            key={i}
            setBoundingBoxForCardToPlay={setBoundingBoxForCardToPlay}
          />
        </div>
      ))}
    </div>
  );
}

// function H

function GameRoom({ gameData, name, onCardClick, onSelectRow }: GameRoomProps) {
  type BoundingBoxes = Record<number, ClientRect | null>;
  const [cardsToPlayBoundingBoxes, setCardsToPlayBoundingBoxes]: [
    BoundingBoxes,
    any
  ] = useState({});

  const getCardToPlayBoundingBox = (cardNumber: number) => {
    if (
      !cardsToPlayBoundingBoxes.hasOwnProperty(cardNumber) ||
      cardsToPlayBoundingBoxes[cardNumber] === null
    ) {
      return null;
    }
    const boundingBoxCopy = JSON.parse(
      JSON.stringify(cardsToPlayBoundingBoxes[cardNumber])
    );
    console.log("erasing bbox");
    // setCardsToPlayBoundingBoxes((currentBoundingBoxes: BoundingBoxes) => ({
    //   ...currentBoundingBoxes,
    //   [cardNumber]: null,
    // }));
    console.log(`returning bbox: ${boundingBoxCopy}`);
    return boundingBoxCopy;
  };

  const setBoundingBoxForCardToPlay = (
    cardNumber: number,
    boundingBox: ClientRect | null
  ) => {
    setCardsToPlayBoundingBoxes((currentBoundingBoxes: BoundingBoxes) => {
      console.log(`getting bbox ${JSON.stringify(boundingBox)}`);
      return {
        ...currentBoundingBoxes,
        [cardNumber]: boundingBox,
      };
    });
  };

  if (gameData === null) {
    console.log("no game data");
    return null;
  }

  const hand = gameData.players.find((player) => player.name === name)?.hand;
  if (!hand) {
    console.log("missing hand");
    return null;
  }

  // TODO add state for card bounding boxes

  return (
    <div className="gameRoom">
      <Hand
        hand={hand}
        onCardClick={onCardClick}
        disabled={gameData.cardsToPlay.length !== 0}
      />
      <div className="boardAndCardsToPlay">
        <Board
          board={gameData.board}
          cardsToPlay={gameData.cardsToPlay}
          onSelectRow={onSelectRow}
          playerName={name}
          getCardToPlayBoundingBox={getCardToPlayBoundingBox}
        />
        {gameData.cardsToPlay.length !== 0 && (
          <CardsToPlay
            cardsToPlay={gameData.cardsToPlay}
            setBoundingBoxForCardToPlay={setBoundingBoxForCardToPlay}
          />
        )}
      </div>
    </div>
  );
}

export default GameRoom;
