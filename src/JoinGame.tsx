import { useState } from "react";

type JoinGamePropTypes = {
  onNameSubmit: (name: string) => void;
  disabled: boolean;
};

function JoinGame({ onNameSubmit, disabled }: JoinGamePropTypes) {
  const [name, setName] = useState("");

  return (
    <>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        onChange={(event) => setName(event.target.value)}
      />
      <button
        onClick={() => {
          onNameSubmit(name);
        }}
        disabled={disabled}
      >
        Join
      </button>
    </>
  );
}

export default JoinGame;
