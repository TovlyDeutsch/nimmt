import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Game from "./Game";

function App() {
  // return <Game />;
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/game/:gameId" component={Game} />
        {/* <Route exact path="/about" component={AboutPage} />
            <Route exact path="/conduct" component={ConductPage} />
            <Route exact path="/donate" component={DonatePage} />
            <Route exact path="/legal" component={LegalPage} />
            <Route exact path="/" component={LobbyPage} />
            <Route exact path="/room/:id" component={RoomPage} />
            <Route exact path="/game/:id" component={GamePage} />
            <Route exact path="/profile/:id" component={ProfilePage} /> */}
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
