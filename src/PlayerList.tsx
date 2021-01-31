import classnames from "classnames";
import { Player } from "./gameStructures";

export function PlayerList({
  players,
  gameOver = false,
}: {
  players: Array<Player>;
  gameOver?: boolean;
}) {
  if (gameOver) {
    players = players.sort((p1, p2) => p1.points - p2.points);
  }

  return (
    <ol
      className={classnames({
        playerList: true,
        gamePlayerList: !gameOver,
      })}
    >
      {players.map((player) => (
        <PlayerBox player={player} showWaiting={!gameOver} />
      ))}
    </ol>
  );
}

function PlayerBox({
  player,
  showWaiting,
}: {
  player: Player;
  showWaiting: boolean;
}) {
  const cardSelected = player.hand.find((card) => card.selected);

  return (
    <li className="playerBox">
      <h3 style={{ margin: "0px" }}>{player.name}</h3>
      <p style={{ marginTop: "5px", marginBottom: "5px" }}>{player.points}</p>
      {!cardSelected && showWaiting && (
        <p style={{ marginTop: "5px", marginBottom: "0px" }}>⌛</p>
      )}
    </li>
  );
}
