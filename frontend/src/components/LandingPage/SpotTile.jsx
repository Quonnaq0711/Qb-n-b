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
      <img src={spot.previewImage} />
      <h4>{spot.name}</h4>
      <div className="location">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="price">${spot.price}/night</div>
      <SpotDetailsPage spot={spot} /> {/* Pass the individual spot */}
    </div>
  );
}

export default SpotTile;

