import { useState } from "react";
import { Button, TextField } from "@material-ui/core";

type JoinGamePropTypes = {
  onNameSubmit: (name: string) => void;
  disabled: boolean;
};

function JoinGame({ onNameSubmit, disabled }: JoinGamePropTypes) {
  const [name, setName] = useState("");

  return (
    <form>
      <TextField
        label="Name"
        onChange={(event) => setName(event.target.value)}
      />

      <Button
        onClick={() => {
          onNameSubmit(name);
        }}
        disabled={disabled}
        color="primary"
        variant="contained"
      >
        Join
      </Button>
    </form>
  );
}

export default JoinGame;
