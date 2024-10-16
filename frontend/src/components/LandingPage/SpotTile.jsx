
import './TileList.css';
import './SpotTile.css';
import { useNavigate } from 'react-router-dom';

function SpotTile({ spot }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/spots/${spot.id}`); // Navigate to the spot detail page
  };

  const averageRating = spot.reviews.length
    ? (
        spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length
      ).toFixed(1)
    : 'New';

  return (
    <div className="spot-tile" onClick={handleClick}>
      <img src={spot.thumbnail} alt={spot.name} className="spot-thumbnail" />
      <div className="spot-info">
        <h2 className="spot-name" title={spot.name}>{spot.name}</h2>
        <p className="spot-location">{`${spot.city}, ${spot.state}`}</p>
        <div className="spot-rating">
          <span>{averageRating} ★</span>
        </div>
        <p className="spot-price">{`$${spot.price} night`}</p>
      </div>
    </div>
  );
}

export default SpotTile;
