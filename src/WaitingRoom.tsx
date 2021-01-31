import { Button } from "@material-ui/core";
import { Player } from "./gameStructures";
import { InviteLink } from "./InviteLink";

type WaitingRoomProps = {
  onGameStart: () => void;
  players: Array<Player>;
  link: string;
};

function WaitingRoom({ onGameStart, players, link }: WaitingRoomProps) {
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
      <InviteLink link={link} />
    </div>
  );
}

export default WaitingRoom;
