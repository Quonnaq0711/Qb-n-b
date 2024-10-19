import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDetails, loadSpots } from '../../store/landingPage';
import { loadReviews } from '../../store/review';
import { useParams } from 'react-router-dom';
import './IndividualSpot.css';

function IndividualSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);

  console.log('Spot ID:', spotId);

  const { details: IndividualSpot, reviews } = useSelector(state => ({
    details: state.spots.details,
    reviews: state.reviews,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);      
        await dispatch(loadSpots());
        await dispatch(loadDetails(spotId));
        await dispatch(loadReviews(spotId));        
       {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, spotId]);

  if (loading) return <div>Loading...</div>;
  if (!IndividualSpot) return <div>Spot not found.</div>;

  const handleReserveClick = () => {
    alert("Feature coming soon...");
  };

  return (
    <div className="spot-details-page">
      <h2 className="spot-name">{IndividualSpot.name}</h2>
      <div className="location">
        {IndividualSpot.city}, {IndividualSpot.state}, {IndividualSpot.country}
      </div>
      <div className="details-container">
        {IndividualSpot.SpotImages?.length > 0 && (
          <img
            className="spot-image"
            src={IndividualSpot.SpotImages[0]?.url}
            alt={`${IndividualSpot.name} main image`}
          />
        )}
        <div className="other-images">
          {IndividualSpot.SpotImages?.slice(1).map(image => (
            <img
              key={image.id}
              className="thumbnail"
              src={image.url}
              alt="Spot Thumbnail"
            />
          ))}
        </div>
      </div>
      <div className="info-container">
        <div className="spot-info">
          <div className="host-info">
            Hosted by {IndividualSpot.Owner?.firstName || 'Unknown'} {IndividualSpot.Owner?.lastName || ''}
          </div>
          <div className="description">{IndividualSpot.description}</div>
        </div>
        <div className="price-info">
          <div className="bordered-box">
            <div className="price">${IndividualSpot.price} per night</div>
            <div className="review-summary">
              <div className="average-rating">
                <span className="star-icon">★</span>
                {IndividualSpot.avgStarRating ? IndividualSpot.avgStarRating.toFixed(1) : 'New'}
                {IndividualSpot.numReviews > 0 && (
                  <>
                    <span className="dot"> · </span>
                    {IndividualSpot.numReviews === 1 ? "1 Review" : `${IndividualSpot.numReviews} Reviews`}
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
            {IndividualSpot.avgStarRating ? IndividualSpot.avgStarRating.toFixed(1) : 'New'}
            {IndividualSpot.numReviews > 0 && (
              <>
                <span className="dot"> · </span>
                {IndividualSpot.numReviews === 1 ? "1 Review" : `${IndividualSpot.numReviews} Reviews`}
              </>
            )}
          </div>
        </div>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map(review => (
            <div className="review" key={review.id}>
              <div className="reviewer-name">{review.User?.firstName || 'Anonymous'}</div>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <div className="review-details">{review.review}</div>
            </div>
          ))
        ) : (
          <div>Be the first to post a review!</div>
        )}
      </div>
    </div>
  );
}

export default IndividualSpot;







