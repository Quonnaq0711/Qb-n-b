import SpotTile from './SpotTile';
import './TileList.css';

function TileList({ spots }) {
  return (
    <div className="tile-list">
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
}

export default TileList;