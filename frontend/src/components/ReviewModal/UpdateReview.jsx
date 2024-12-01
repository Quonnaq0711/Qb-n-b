import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editReviews } from '../../store/review';
import './ReviewModal.css';

function UpdateReview({ onClose }) {
    const { reviewId } = useParams();  // Correct use of useParams to extract reviewId
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Find the review by ID
    const review = useSelector(state => state.reviews.reviews.find(r => r.id === parseInt(reviewId))); 

    const [reviewForm, setReviewForm] = useState({
        review: '',
        star: '',
    });

    const [error, setError] = useState(null);  // For handling errors
    const [success, setSuccess] = useState(null);  // For success messages

    useEffect(() => {
        if (review) {
            setReviewForm({
                review: review.review || '',
                star: review.star || '1',  // Default to 1 if there's no star rating
            });
        }
    }, [review]);  // Trigger when the review data changes
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Dispatch the review update action
            await dispatch(editReviews(reviewId, reviewForm));  // Pass spotId here

            setSuccess("Review updated successfully!");

            // Clear success message after a short period
            setTimeout(() => {
                setSuccess(null);
                onClose();  // Close the modal after submission
                navigate(`/spots/${review.spotId}`);  // Redirect to the spot's detail page

            }, 2000);
        } catch (err) {
            setError("Failed to update review.");
            setTimeout(() => setError(null), 5000);  // Clear error after a while
        }
    };

    return (
        <div className="review-container">
            <h2>Update Your Review</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    className="reviewtextarea"
                    name="review"
                    placeholder="Leave your review here..."
                    value={reviewForm.review}
                    onChange={handleChange}
                    required
                />
                <div>
                    <label className='reviewlabel'>Stars:</label>
                    <select
                        className="input"
                        name="star"
                        value={reviewForm.star || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a rating</option>
                        {[1, 2, 3, 4, 5].map(star => (
                            <option key={star} value={star}>{star}</option>
                        ))}
                    </select>
                </div>
                <button
    type="submit"
    disabled={reviewForm.review.length < 10 || !reviewForm.star}
>
    Submit Your Review
</button>

            </form>
            <button className="Close" onClick={onClose}>Close</button>
        </div>
    );
}

export default UpdateReview;

