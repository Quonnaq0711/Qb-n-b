import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDetails, loadSpots } from '../../store/landingPage';
import { deleteReview, loadReviews } from '../../store/review';
import ReviewModal from '../ReviewModal/ReviewModal';
import { useParams } from 'react-router-dom';
import DeleteReview from '../ManageSpot/DeleteReview';
import './IndividualSpot.css';

function IndividualSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); 

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

   // Open the confirmation modal 
   const openDeleteModal = (spotId) => { 
    setModalContent( <DeleteReview spotId={spotId} 
    onDeleteConfirm={() => handleDelete(spotId)} 
    onClose={() => setModalContent(null)} /> );
 };  

 const handleDelete = async (reviewId) => {
  try {
    await dispatch(deleteReview(reviewId)); // Dispatch the delete action
  } catch (error) {
    console.error("Failed to delete the review:", error);
    alert("There was an error deleting the review. Please try again.");
  }
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
        {currentUser && !isOwner && hasReviewed && (
          <button onClick={() => openDeleteModal(reviews.id)} className="delete-button">Delete</button>
        )}
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <ul>
            {reviews.map(review => (
              <li key={review.id}>
                <div className='container'>
                  <strong>{review.User.firstName}:</strong>
                </div>
                <div className='content'>               
                <div >{review.review}</div>                
                <span className="review-rating">
                  <span className='star-icon'>★</span>
                  {review.stars}</span>
                <div>{review.createdAt}</div>
                </div>
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
      {modalContent}
    </div>    
  );  
}

export default IndividualSpot;