
import './TileList.css';
import Spot from './Spot'; // Import the SpotTile component

function TileList({ spots }) {
  const spotsArray = spots || [];

  if (spotsArray.length === 0) {
    return <p>No spots available.</p>;
  }

  return (
    <div className="tile-list">
      {spotsArray.map(spot => (
        <Spot key={spot.id} spot={spot} /> // Use SpotTile for each spot
      ))}
    </div>
  );
}

export default TileList;



  

