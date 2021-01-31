import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import CreateGame from "./CreateGame";
import Game from "./Game";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/game/:gameId" component={Game} />
        <Route component={CreateGame} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
