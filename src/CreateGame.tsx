import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

function CreateGame() {
  const history = useHistory();

  return (
    <div className="center">
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          const randomGameId = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: "-",
          });

          history.push(`/game/${randomGameId}`);
        }}
      >
        Create Game
      </Button>
    </div>
  );
}

export default CreateGame;
