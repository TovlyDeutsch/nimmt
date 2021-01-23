import React, { useState } from "react";
import { useFirebaseRef } from "./useFirebaseRef";
import { GameData, setUpGame, addPlayer } from "./gameStructures";
import JoinGame from "./JoinGame";

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

  updateGameWithFunction(setUpGame);

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

  return <>{JSON.stringify(gameData)}</>;
}

export default Game;
