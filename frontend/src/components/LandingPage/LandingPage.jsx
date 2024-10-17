import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpots, } from '../../store/landingPage';
import TileList from './TileList';

// LandingPage Component
const LandingPage = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots)  

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch, spots]);

  console.log(spots);

  return (
    <div className="landing-page">
      <h1>Available Spots</h1>
      {isLoaded ? <TileList spots={spots} /> : <p>Loading...</p>}
    </div>
  );
};

export default LandingPage;
