import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { InviteLink } from "./InviteLink";

type JoinGamePropTypes = {
  onNameSubmit: (name: string) => void;
  disabled: boolean;
  link: string;
};

function JoinGame({ onNameSubmit, disabled, link }: JoinGamePropTypes) {
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
      <InviteLink link={link} />
    </div>
  );
}

export default JoinGame;
