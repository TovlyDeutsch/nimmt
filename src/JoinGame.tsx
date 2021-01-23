import { useState } from "react";
import { Button, TextField } from "@material-ui/core";

type JoinGamePropTypes = {
  onNameSubmit: (name: string) => void;
  disabled: boolean;
};

function JoinGame({ onNameSubmit, disabled }: JoinGamePropTypes) {
  const [name, setName] = useState("");

  return (
    <div className="center">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onNameSubmit(name);
        }}
      >
        <TextField
          label="Name"
          onChange={(event) => setName(event.target.value)}
        />

        <Button
          disabled={disabled}
          color="primary"
          variant="contained"
          type="submit"
        >
          Join
        </Button>
      </form>
    </div>
  );
}

export default JoinGame;
