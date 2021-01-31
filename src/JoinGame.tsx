import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
// import DoneIcon from "@material-ui/icons/Done";
// import LinkIcon from "@material-ui/icons/Link";
import { useState } from "react";

type JoinGamePropTypes = {
  onNameSubmit: (name: string) => void;
  disabled: boolean;
  gameId: string;
};

function InviteLink({ link }: { link: string }) {
  const [copiedLink, setCopiedLink] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => setCopiedLink(true));
  }
  return (
    <div>
      To invite someone to play, share this URL:
      <span className={"shareLink"}>
        <input
          className={"simpleInput"}
          readOnly
          value={link}
          onFocus={(event: any) => event.target.select()}
        />
        <Tooltip
          placement="top"
          title={copiedLink ? "Link copied" : "Copy link"}
        >
          <IconButton onClick={handleCopy}>
            {/* {copiedLink ? <DoneIcon /> : <LinkIcon />} */}
          </IconButton>
        </Tooltip>
      </span>
    </div>
  );
}

function JoinGame({ onNameSubmit, disabled, gameId }: JoinGamePropTypes) {
  const [name, setName] = useState("");

  const link = `${window.location.origin}/${gameId}`;

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
