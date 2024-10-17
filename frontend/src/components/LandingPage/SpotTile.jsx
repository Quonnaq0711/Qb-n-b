import SpotDetailsPage from '../SpotDetails/spotDetails';
import './SpotTile.css';
import { useNavigate } from 'react-router-dom';

function SpotTile({ spot }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/spots/${spot.id}`); // Navigate to the spot detail page
  };

  return (
    <div className="spot-tile" onClick={handleClick}>
      <h4>{spot.name}</h4>
      <SpotDetailsPage spot={spot} /> {/* Pass the individual spot */}
    </div>
  );
}

export default SpotTile;

