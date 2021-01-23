import React, { useState, useEffect } from "react";
import { useFirebaseRef } from "./useFirebaseRef";
import { GameData, setUpGame, startGame, addPlayer } from "./gameStructures";
import JoinGame from "./JoinGame";
import GameRoom from "./GameRoom";
import WaitingRoom from "./WaitingRoom";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const BOARD_KEY = "game" + getRandomInt(100000000).toString();
console.log("loading game " + BOARD_KEY);

function Game() {
  // const location = useLocation();
  // TODO make this based on route

  let [
    gameData,
    updateGameWithFunction,
    gameDataLoading,
  ] = useFirebaseRef<GameData>(`testGame1/gameData/${BOARD_KEY}`);

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (gameData === null) {
      updateGameWithFunction(setUpGame);
    }
  }, [gameData, updateGameWithFunction]);

  console.log(`game started: ${gameData?.started}`);

  if (name === null) {
    return (
      <JoinGame
        onNameSubmit={(name) => {
          updateGameWithFunction(addPlayer(name));
          setName(name);
        }}
        disabled={gameDataLoading}
      />
    );
  } else if (!gameData?.started) {
    return (
      <WaitingRoom
        onGameStart={() => {
          updateGameWithFunction(startGame);
        }}
      />
    );
  }
  console.log(`rendering game room with name ${name}`);

  return <GameRoom gameData={gameData} name={name} />;
}

export default Game;
