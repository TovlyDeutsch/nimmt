import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameRoom from "./GameRoom";
import {
  addPlayer,
  checkEndAndstartNewRoundIfNeccessary,
  GameData,
  isGameOver,
  markCardInBoard,
  playCardInRow,
  processNextCardToPlay,
  selectCardForPlayer,
  setUpGame,
  startGame,
} from "./gameStructures";
import JoinGame from "./JoinGame";
import { PlayerList } from "./PlayerList";
import { useFirebaseRef } from "./useFirebaseRef";
import WaitingRoom from "./WaitingRoom";

type urlParams = {
  gameId: string;
};

function Game() {
  let { gameId } = useParams<urlParams>();

  let [
    gameData,
    updateGameWithFunction,
    gameDataLoading,
  ] = useFirebaseRef<GameData>(`gameData/${gameId}`);

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // TODO make these into one function
    if (gameData === null) {
      updateGameWithFunction(setUpGame);
    } else if (gameData.cardsToPlay.length !== 0) {
      updateGameWithFunction(processNextCardToPlay);
    } else if (gameData.started) {
      updateGameWithFunction(checkEndAndstartNewRoundIfNeccessary);
    }
  }, [gameData, updateGameWithFunction]);

  console.log(`game started: ${gameData?.started}`);
  if (gameData === null) {
    return <p>Loading</p>;
  } else if (name === null) {
    return (
      <JoinGame
        onNameSubmit={(name) => {
          updateGameWithFunction(addPlayer(name));
          setName(name);
        }}
        disabled={gameDataLoading}
      />
    );
  } else if (!gameData.started) {
    return (
      <WaitingRoom
        onGameStart={() => {
          updateGameWithFunction(startGame);
        }}
        players={gameData.players}
      />
    );
  }
  console.log(`rendering game room with name ${name}`);

  if (!isGameOver(gameData)) {
    return (
      <GameRoom
        gameData={gameData}
        name={name}
        onCardClick={(card) => {
          updateGameWithFunction(selectCardForPlayer(name, card.number));
        }}
        onSelectRow={(rowIndex) => {
          updateGameWithFunction(playCardInRow(rowIndex, true));
        }}
        onCardAddedToBoard={(cardToPlayIndex) => {
          updateGameWithFunction(markCardInBoard(cardToPlayIndex));
        }}
      />
    );
  } else {
    return (
      <div className="center">
        <h1>Game Over</h1>
        <PlayerList players={gameData.players} gameOver={true} />
      </div>
    );
  }
}

export default Game;
