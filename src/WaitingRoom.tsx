import { Button } from "@material-ui/core";
import { Player } from "./gameStructures";

type WaitingRoomProps = {
  onGameStart: () => void;
  players: Array<Player>;
};

function WaitingRoom({ onGameStart, players }: WaitingRoomProps) {
  return (
    <div className="waitingRoom center">
      <h1>Players:</h1>

      {players.map((player, i) => (
        <p key={i}>{player.name}</p>
      ))}
      <Button
        onClick={(e) => {
          onGameStart();
        }}
        color="primary"
        variant="contained"
      >
        {" "}
        Start game{" "}
      </Button>
    </div>
  );
}

export default WaitingRoom;
