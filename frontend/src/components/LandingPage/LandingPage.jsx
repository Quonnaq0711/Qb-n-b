import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpots } from '../../store/landingPage';
import TileList from './TileList';
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const session = useSelector((state) => state.session.user); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        await dispatch(loadSpots());
      } catch (err) {
        setError('Failed to load spots. Please try again later.');
      }
    };

    fetchSpots();
  }, [dispatch]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!spots || spots.length === 0) {
    return <p>No spots available at the moment.</p>;
  }

  return (
    <div className="landing-page">
      {!session || Object.keys(session).length === 0 ? (       
         <h1 className='landing-pageh1'>Welcome !</h1>       
      ) : (
        <h1 className='landing-pageh1'>Welcome Back !</h1>
      )}
      <h2>Available Spots</h2>
      <TileList spots={spots} />
    </div>
  );
};

export default LandingPage;




