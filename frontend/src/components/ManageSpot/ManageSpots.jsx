import { useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import { deleteSpot, loadSpots } from '../../store/landingPage'; 
import { useEffect, useState } from 'react'; 
import DeleteModal from './DeleteSpot'; 
import './ManageSpot.css'; 

function ManageSpots() { 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const sessionUser = useSelector(state => state.session.user); 
  const spots = useSelector(state => state.spots.spots); 
  
  // Filter spots to only include those created by the current user 
  const userSpots = spots.filter(spot => spot.ownerId === sessionUser.id); 
  const [modalContent, setModalContent] = useState(null); 

  // Load spots when the component mounts 
  useEffect(() => { 
    dispatch(loadSpots());
  }, [dispatch]); 
  
  // Open the confirmation modal 
  const openDeleteModal = (spotId, event) => { 
    event.stopPropagation(); // Prevent the event from bubbling
    setModalContent(
      <DeleteModal 
        spotId={spotId} 
        onDeleteConfirm={() => handleDelete(spotId)} 
        onClose={() => setModalContent(null)} 
      />
    );
  };

  const handleDelete = async (spotId,) => {
    // event.stopPropagation(); 
    try {
      await dispatch(deleteSpot(spotId));       
      dispatch(loadSpots()); 
    } catch (error) {
      console.error("Failed to delete the spot:", error);
      alert("There was an error deleting the spot. Please try again.");
    }
  };

  const handleUpdate = (spotId, event) => {
    event.stopPropagation(); 
    navigate(`/spots/${spotId}/edit`);
  };

  const handleClick = (spotId) => {
    navigate(`/spots/${spotId}`)
  };
   
  const handleNoSpot = () => {
    navigate('/spots')
  };

  return (
    <div className="manage-spot">
      <h1 className="spot-title">Manage Spots</h1>

      {userSpots.length === 0 ? (
        <div className="no-spots">
          <p>You don’t have any spots yet.</p>
          <button onClick={handleNoSpot} className="create-new-spot">
            Create a New Spot
          </button>
        </div>
      ) : (
        userSpots.map(spot => (
          <div 
            key={spot.id} 
            onClick={() => handleClick(spot.id)} 
            className="spot-tile" 
            name={spot.name}
          >
            <img src={spot.previewImage } alt={spot.name} />
            <div className="spot-info">
              <div className="location-price-rating">
                <div className="location-price">
                  <div>{spot.city}, {spot.state}</div>
                  <div>${spot.price} / night</div>
                </div>
                <div className="star-rating">
                  <span className="star-icon">★</span>
                  {spot.avgRating ? spot.avgRating : 'New'}
                </div>
              </div>
            </div>
            <div className="spot-actions">
              <button 
                onClick={(e) => handleUpdate(spot.id, e)} 
                className="update-button">Update</button>
              <button 
                onClick={(e) => openDeleteModal(spot.id, e)} 
                className="delete-button">Delete</button>
            </div>
          </div>
        ))
      )}
      {modalContent}
    </div>
  );
}

export default ManageSpots;






