import React, { useState } from "react";
import "./App.css";

interface Card {
  number: Number;
  points: Number;
  selected: Boolean;
}
// TODO see if this can be parametrizes to something like number 5
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

function App() {
  const gameState = useState<GameState>({
    board: [[], [], [], [], []],
    hands: [],
    players: new Set(),
    started: false,
  });

  return <div className="App">{JSON.stringify(gameState)}</div>;
}

export default App;
