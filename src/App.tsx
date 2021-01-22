import React, { useState } from "react";
import "./App.css";
import firebase from "./firebaseInitialize";
import useFirebaseRef from "./useFirebaseRef";

interface Card {
  number: Number;
  points: Number;
  selected: Boolean;
}
// TODO see if this can limit these to certain size
type Row = Array<Card>;
type Board = Array<Row>;
type Hand = Array<Card>;

interface Player {
  id: String;
  points: Number;
}

interface GameState {
  board: Board;
  hands: Array<Hand>;
  players: Set<Player>;
  started: boolean;
}

// function gameStateMod()

function App() {
  const [board, updateBoard, boardLoading] = useFirebaseRef(
    "testGame1/gameData/board"
  );
  // const [gameState, updateGameState] = useState<GameState>({
  //   board: [[], [], [], [], []],
  //   hands: [],
  //   players: new Set(),
  //   started: false,
  // });

  function getRandomInt(max: any) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function addPlayer() {
    // TODO atempt to update firebase with new state
    // update react state
  }

  return (
    <div className="App">
      {JSON.stringify(board)}
      <button
        onClick={() => {
          updateBoard([[{ number: getRandomInt(10) }]]);
        }}
      ></button>
    </div>
  );
}

export default App;
