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
      <img className='img' src={spot.previewImage ? spot.previewImage : spot.image} />
      <h4>{spot.name}</h4>
      <div className="tilelocation">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="tileprice">${spot.price}/night</div>
      <div className="starRatings"> ★ </div>
      {spot.avgStarRating ? spot.avgStarRating : 'New'}
      {spot.numReviews > 0 && (
  <>
    <span className="dot"> · </span>
    {spot.numReviews === 1 ? "1 Review" : `${spot.numReviews} Reviews`}
  </>
)}       
      <SpotDetailsPage spot={spot} /> {/* Pass the individual spot */}     
    </div>
  );
}

export default Spot;
