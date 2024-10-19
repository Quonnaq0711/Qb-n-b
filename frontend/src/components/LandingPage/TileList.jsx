import './TileList.css';
import Spot from './Spot'; 

function TileList({ spots }) {
  const spotsArray = Array.isArray(spots) ? spots : []; // Ensure spots is an array

  if (spotsArray.length === 0) {
    return <p>No spots available.</p>;
  }

  return (
    
    <div className="tile-list">
      {spotsArray.map(spot => (
        <Spot key={spot.id} spot={spot} /> // Use Spot for each spot
      ))}
    </div>
  );
}


export default TileList; 

