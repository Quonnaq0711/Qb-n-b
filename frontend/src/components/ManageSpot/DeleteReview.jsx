import { useEffect, useRef } from 'react';
import './deleteModal.css';


function DeleteReview({ reviewId, onDeleteConfirm, onClose }) {
  const modal = useRef(null);
    
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
        }, [onClose]); 


  const handleConfirmDelete = () => {
    onDeleteConfirm(reviewId);
    onClose();  // Close the modal after confirming
    
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this review?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={handleConfirmDelete}>
            Yes (Delete Review)
          </button>
          <button className="cancel-button" onClick={onClose}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteReview;