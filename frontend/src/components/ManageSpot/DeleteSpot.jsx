import { useEffect, useRef } from 'react';
import { useModal } from '../../context/modal';  // Assuming you have a Modal context
import './deleteModal.css';

function DeleteModal({ spotId, onDeleteConfirm, onClose }) {
    const { closeModal } = useModal();
    const modal = useRef(null);
    
    useEffect(() => {
        const outsideClick = (e) => {
            if (modal.current && !modal.current.contains(e.target)) {
              closeModal();
            }
          };
        
          document.addEventListener('mousedown', outsideClick);
        
          return () => {
            document.removeEventListener('mousedown', outsideClick);
          };
        }, [closeModal]); 


  const handleConfirmDelete = () => {
    onDeleteConfirm(spotId);
    closeModal();  // Close the modal after confirming
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={handleConfirmDelete}>
            Yes (Delete Spot)
          </button>
          <button className="cancel-button" onClick={onClose}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
