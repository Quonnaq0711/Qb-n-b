import SpotTile from './SpotTile';
import './TileList.css';

function TileList({ spots = {spots} }) { 
  const spotsArray = spots.Spots || [];

  if (spotsArray.length === 0) {
    return <p>No spots available.</p>;
  }
  return (
    <>
    <div className="tile-list">
      {spotsArray.map((spot) => (
        <SpotTile key={spot.id} spots={spot} />
      ))}
      </div>
    </>
  );
}

export default TileList;

  

