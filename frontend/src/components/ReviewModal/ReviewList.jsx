// import { ReviewModal } from './ReviewModal';



function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <p>No reviews available.</p>;
    }

    return (
        <div className="review-list">
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <strong>{review.user.firstName}:</strong> {review.comment}
                        <span className="review-rating"> ★{review.rating}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReviewList;




