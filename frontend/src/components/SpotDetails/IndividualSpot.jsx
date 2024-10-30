import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDetails, loadSpots } from '../../store/landingPage';
import { loadReviews } from '../../store/review';
import ReviewModal from '../ReviewModal/ReviewModal';
import { useParams } from 'react-router-dom';
import './IndividualSpot.css';

function IndividualSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const individualSpot = useSelector(state => state.spots.details);
  const reviews = useSelector(state => state.reviews.reviews);
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        await dispatch(loadSpots());
        await dispatch(loadDetails(spotId));
        await dispatch(loadReviews(spotId));
      } catch (err) {
        console.error(err); // Log error for debugging
        setError('Failed to load data. Please try again later.');
      }
    };   
    fetchData();
  }, [dispatch, spotId]);

  if (error) return <div className="error-message">{error}</div>;
  if (!individualSpot) return <div className="error-message">Spot not found.</div>;

  const hasReviewed = Array.isArray(reviews) && reviews.some(review => review.userId === currentUser?.id);
  const isOwner = currentUser?.id === individualSpot?.Owner?.id;

  const handleReserveClick = () => {
    alert("Feature coming soon...");
  };

  const handleReviewSubmit = () => {
    dispatch(loadReviews(spotId));
    setModalOpen(false);
  };

  return (
    <div className="spot-details-page">
      <h2 className="spot-name">{individualSpot.name}</h2>
      <div className="location">
        {individualSpot.city}, {individualSpot.state}, {individualSpot.country}
      </div>
      <div className="details-container">
        {individualSpot.SpotImages?.length > 0 && (
          <img
            className="spot-image"
            src={individualSpot.SpotImages[0]?.url}
            alt={`${individualSpot.name} main image`}
          />
        )}
        <div className="other-images">
          {individualSpot.SpotImages?.slice(1).map((image, index) => (
            <img
              key={image.id}
              className="thumbnail"
              src={image.url}
              alt={`Thumbnail of ${individualSpot.name} image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="info-container">
        <div className="spot-info">
          <div className="host-info">
            Hosted by {individualSpot.Owner?.firstName || 'Unknown'} {individualSpot.Owner?.lastName || ''}
          </div>
          <div className="description">{individualSpot.description}</div>
        </div>
        <div className="price-info">
          <div className="bordered-box">
            <div className="price">${individualSpot.price} per night</div>
            <div className="review-summary">
              <div className="average-rating">
                <span className="star-icon">★</span>
                {individualSpot.avgStarRating ? individualSpot.avgStarRating.toFixed(1) : 'New'}
                {individualSpot.numReviews > 0 && (
                  <>
                    <span className="dot"> · </span>
                    {individualSpot.numReviews === 1 ? "1 Review" : `${individualSpot.numReviews} Reviews`}
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
        {currentUser && !isOwner && !hasReviewed && (
          <button onClick={() => setModalOpen(true)}>Post Your Review</button>
        )}
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <ul>
            {reviews.map(review => (
              <li key={review.id}>
                <strong>{review.User.firstName}:
                </strong> {review.review} 
                <span className="review-rating"> ★{review.stars}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Be the first to post a review!</div>
        )}
      </div>
      {isModalOpen && (
        <ReviewModal
          spotId={spotId}
          onClose={() => setModalOpen(false)}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

export default IndividualSpot;


















