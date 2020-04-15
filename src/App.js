import React from "react";
import GameTicTacToe from "./features/tic-tac-toe/Game";

import "./App.css";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameTicTacToe />
      </header>
    </div>
  );
}

export default App;
