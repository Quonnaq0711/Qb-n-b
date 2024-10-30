// SpotDetailsPage.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDetails } from '../../store/landingPage'; 
import { useParams } from 'react-router-dom'; 
import './spotDetails.css';

function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector(state => state.spots.details);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      await dispatch(loadDetails(spotId)); // loadDetails fetches a single spot
      
      setLoading(false);
    };    
    fetchData();
  }, [dispatch, spotId]);

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  // if (!spotDetails) return <div className="error-message">Spot not found.</div>;

  setError('Failed to load spot details. Please try again later.');
  
  return (
    <div className="spot-details-page">
      <h2 className="spot-name">{spotDetails.name}</h2>
      <div className="location">
        {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </div>
      <div className="details-container">
        {spotDetails.SpotImages?.length > 0 && (
          <img
            className="spot-image"
            src={spotDetails.SpotImages[0]?.url}
            alt={`Main image of ${spotDetails.name}`}
          />
        )}
        <div className="other-images">
          {spotDetails.SpotImages?.slice(1).map(image => (
            <img
              key={image.id}
              className="thumbnail"
              src={image.url}
              alt={`Thumbnail of ${spotDetails.name}`}
            />
          ))}
        </div>
      </div>
      <div className="info-container">
        <div className="spot-info">
          <div className="host-info">
            Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
          </div>
          <div className="description">{spotDetails.description}</div>
        </div>
        <div className="price-info">
          <div className="bordered-box">
            <div className="price">${spotDetails.price} per night</div>
            <div className="review-summary">
              <div className="average-rating">
                <span className="star-icon">★</span>
                {spotDetails.avgStarRating ? spotDetails.avgStarRating.toFixed(1) : 'New'}
                {spotDetails.numReviews > 0 && (
                  <>
                    <span className="dot"> · </span>
                    {spotDetails.numReviews === 1 ? "1 Review" : `${spotDetails.numReviews} Reviews`}
                  </>
                )}
              </div>
            </div>            
          </div>
        </div>
      </div>     
    </div>
  );
}

export default SpotDetailsPage;






