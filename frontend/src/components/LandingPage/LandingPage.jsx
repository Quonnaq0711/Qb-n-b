import { useEffect, } from 'react';
import { useDispatch,  } from 'react-redux';
import { loadSpots, spotsSelector } from '../../store/landingPage';
import TileList from './TileList';
import { useSelector } from 'react-redux';


// LandingPage Component
const LandingPage = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const spots = useSelector(spotsSelector); //state path
 
    

  useEffect(() => {
   dispatch(loadSpots());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <h1>Available Spots</h1>
      {isLoaded ? <TileList spots={spots} /> : <p>Loading...</p>}
      </div> 
  );
};

export default LandingPage;