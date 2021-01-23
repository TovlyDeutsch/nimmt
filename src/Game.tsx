import React, { useState, useEffect } from "react";
import { useFirebaseRef } from "./useFirebaseRef";
import { GameData, setUpGame, addPlayer } from "./gameStructures";
import JoinGame from "./JoinGame";
import GameRoom from "./GameRoom";

function Game() {
  // const location = useLocation();
  // TODO make this based on route
  const BOARD_KEY = "game1";
  let [
    gameData,
    updateGameWithFunction,
    gameDataLoading,
  ] = useFirebaseRef<GameData>(`testGame1/gameData/${BOARD_KEY}`);

  const [name, setName] = useState<string | null>(null);

  // TODO figure out how to make this not run only once
  useEffect(() => {
    if (gameData === null) {
      updateGameWithFunction(setUpGame);
    }
  }, [gameData, updateGameWithFunction]);

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
  }

  return <GameRoom gameData={gameData} />;
}

export default Game;
