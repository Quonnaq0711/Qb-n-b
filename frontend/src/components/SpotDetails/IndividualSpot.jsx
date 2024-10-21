import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDetails, loadSpots } from '../../store/landingPage';
import { loadReviews } from '../../store/review';
import ReviewModal from '../ReviewModal/ReviewModal';
import ReviewList from '../ReviewModal/ReviewList'; 
import { useParams } from 'react-router-dom';
import './IndividualSpot.css';

function IndividualSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const individualSpot = useSelector(state => state.spots.details);
  const reviews = useSelector(state => state.reviews.reviews);
  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(loadSpots());
        await dispatch(loadDetails(spotId));
        await dispatch(loadReviews(spotId));
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, spotId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!individualSpot) return <div>Spot not found.</div>;

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
          {individualSpot.SpotImages?.slice(1).map(image => (
            <img
              key={image.id}
              className="thumbnail"
              src={image.url}
              alt={`Thumbnail of ${individualSpot.name}`}
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
        {currentUser && !isOwner && !hasReviewed && (
          <button onClick={() => setModalOpen(true)}>Post Your Review</button>
        )}
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <ReviewList reviews={reviews} />
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















