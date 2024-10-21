// SpotDetailsPage.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpots } from '../../store/landingPage';
import { loadReviews } from '../../store/review'; 
import { useParams } from 'react-router-dom';
import './spotDetails.css';

function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotid } = useParams();
  const spotDetails = useSelector(state => state.spots.details);
  const reviews = useSelector(state => state.reviews); // Assuming this holds reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(loadSpots(spotid));
        await dispatch(loadReviews(spotid));
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, spotid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!spotDetails) return <div>Spot not found.</div>;

  const handleReserveClick = () => {
    alert("Feature coming soon...");
  };

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
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <hr className="divider" />
      <div className="reviews-section">
        <h3>Reviews</h3>
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
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <ul>
            {reviews.map(review => (
              <li key={review.id}>
                <strong>{review.user.firstName}:</strong> {review.comment} 
                <span className="review-rating"> ★{review.rating}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Be the first to post a review!</div>
        )}
      </div>
    </div>
  );
}

export default SpotDetailsPage;







