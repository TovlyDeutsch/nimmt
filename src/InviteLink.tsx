import { IconButton, Tooltip } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import LinkIcon from "@material-ui/icons/Link";
import { useState } from "react";

export function InviteLink({ link }: { link: string }) {
  const [copiedLink, setCopiedLink] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => setCopiedLink(true));
  }
  return (
    <div className={"sharing"}>
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
            {copiedLink ? <DoneIcon /> : <LinkIcon />}
          </IconButton>
        </Tooltip>
      </span>
    </div>
  );
}
