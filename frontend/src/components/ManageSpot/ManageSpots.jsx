import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteSpot, loadSpots } from '../../store/landingPage';
import './ManageSpot.css';
import { useEffect } from 'react';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spots.spots); 

  // Filter spots to only include those created by the current user
  const userSpots = spots.filter(spot => spot.ownerId === sessionUser.id);

  // Load spots when the component mounts
  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  const handleDelete = async (spotId) => {
    // Confirm deletion with the user
    const confirmed = window.confirm("Are you sure you want to delete this spot? This action cannot be undone.");
    if (confirmed) {
      try {
        // Dispatch delete action to remove the spot
        await dispatch(deleteSpot(spotId));
      } catch (error) {
        console.error("Failed to delete the spot:", error);
        alert("There was an error deleting the spot. Please try again.");
      }
    }
  };

  const handleUpdate = (spotId) => {
    // Navigate to update page for that spot
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="manage-spot">
      <h1 className="spot-title">Manage Spots</h1>

      {userSpots.length === 0 ? (
        <div className="no-spots">
          <p>You dont have any spots yet.</p>
          <button to="/spots" className="create-new-spot">
            Create a New Spot
          </button>
        </div>
      ) : (
        userSpots.map(spot => (
          <div key={spot.id} className="spot-tile" title={spot.name}>
            <img src={spot.previewImage} alt={spot.name} />
            <div className="spot-info">
              <div className="location-price-rating">
                <div className="location-price">
                  <div>{spot.city}, {spot.state}</div>
                  <div>${spot.price} / night</div>
                </div>
                <div className="star-rating">
                  <span className="star-icon">★</span>
                  {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                </div>
              </div>
            </div>

            <div className="spot-actions">
              <button onClick={() => handleUpdate(spot.id)} className="update-button">Update</button>
              <button onClick={() => handleDelete(spot.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageSpots;



