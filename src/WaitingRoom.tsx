import { Button } from "@material-ui/core";

type WaitingRoomProps = {
  onGameStart: () => void;
};

function WaitingRoom({ onGameStart }: WaitingRoomProps) {
  return (
    <div className="waitingRoom center">
      <h1>Waiting Room</h1>
      {/* TODO add name list */}
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
