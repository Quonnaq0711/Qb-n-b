import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/review';
import { useNavigate } from 'react-router-dom';
import './ReviewModal.css';

function ReviewModal({ spotId, onClose }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const modal = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const outsideClick = (e) => {
      if (modal.current && !modal.current.contains(e.target)) {
        onClose();
      }
    };
  
    document.addEventListener('mousedown', outsideClick);
  
    return () => {
      document.removeEventListener('mousedown', outsideClick);
    };
  }, [onClose]); // Cleanup effect on unmount or when onClose changes



  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate comment and rating before dispatching
    if (comment.length < 10 || !rating) {
      setError('Please provide a comment with at least 10 characters and a rating.');
      return;
    }

    // Dispatching the review with comment and rating
    const reviewData = {
      firstName: currentUser.firstName,
      review: comment, 
      stars: rating,
    };

    try {
      await dispatch(createReview(spotId, reviewData)); // Pass the review data here
      setSuccess('Review submitted successfully!');
      setError('');
      setComment(''); 
      setRating(null);
      navigate(`/spots/${spotId}`);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="review-container">
      <h2>How was your stay?</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <textarea className="reviewtextarea"
          placeholder="Leave your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <div>
          <label className='reviewlable'>Stars:</label>
          <select className="input" value={rating || ''} onChange={(e) => setRating(Number(e.target.value))} required>
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={comment.length < 10 || !rating}>
          Submit Your Review
        </button>
      </form>
      <button className="Close" onClick={onClose}>Close</button>
    </div>
  );
}

export default ReviewModal;


