import { Player } from "./gameStructures";

export function PlayerList({ players }: { players: Array<Player> }) {
  return (
    <div className="playerList">
      {players.map((player) => (
        <PlayerBox player={player} />
      ))}
    </div>
  );
}

function PlayerBox({ player }: { player: Player }) {
  const cardSelected = player.hand.find((card) => card.selected);

  return (
    <div className="playerBox">
      <h3 style={{ margin: "0px" }}>{player.name}</h3>
      <p style={{ marginTop: "5px", marginBottom: "5px" }}>{player.points}</p>
      {!cardSelected && (
        <p style={{ marginTop: "5px", marginBottom: "0px" }}>⌛</p>
      )}
    </div>
  );
}
