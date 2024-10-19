import SpotDetailsPage from '../SpotDetails/spotDetails';
import './Spot.css';
import { useNavigate } from 'react-router-dom';

function Spot({ spot }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/spots/${spot.id}`); 
  };

  return (
    <div className="tile" onClick={handleClick}>
      <img src={spot.previewImage} />
      <h4>{spot.name}</h4>
      <div className="location">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="price">${spot.price}/night</div>
      <div className="starRatings"> ★ </div>
        {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : 'New'}               
      <SpotDetailsPage spot={spot} /> {/* Pass the individual spot */}     
    </div>
  );
}

export default Spot;

