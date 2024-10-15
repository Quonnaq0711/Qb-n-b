
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Landings from '../../store/landingPage'; 
import TileList from './TileList'; 

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.spots); // Adjust the state path accordingly

    useEffect(() => {
        const loadSpots = async () => {
            await dispatch(Landings())            
        };
        loadSpots();
    }, [dispatch]);

    return (
        
        <div className="landing-page">
            <h1>Available Spots</h1>
            <TileList spots={spots} />
        </div>
    );
};

export default LandingPage;
