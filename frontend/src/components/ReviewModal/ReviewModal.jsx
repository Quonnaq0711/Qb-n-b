import { useState } from 'react';

function ReviewModal({ spotId, onClose, onReviewSubmit }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Server error.');
        return;
      }

      const newReview = await response.json();
      onReviewSubmit(newReview);
      setSuccess('Review submitted successfully!');

      // Clear form
      setComment('');
      setRating(null);
      
      // Clear success message after a few seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="modal-container">
      <h2>How was your stay?</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <div>
          <label>Stars:</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
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
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ReviewModal;


