import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpots } from '../../store/landingPage';
import TileList from './TileList';


const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const session = useSelector((state) => state.session); 
  

  useEffect(() => {
    dispatch(loadSpots());
  }, [dispatch]);

  if (!spots) {
    return <p>Loading...</p>;
  }

  return (
    <div className="landing-page">
      {!session ? (
        <>
          <h1>WelcomeBack!</h1>          
        </>
      ) : (
        <>
          <h1>Welcome</h1>
        </>        
      )}
      <h2>Available Spots</h2>
      <TileList spots={spots}  />      
    </div>
  );
};

export default LandingPage;

