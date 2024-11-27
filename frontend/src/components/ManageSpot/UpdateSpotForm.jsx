//Update A Spot//
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './updatespot.css';
import { loadDetails, updateDetails } from '../../store/landingPage';  // Assuming loadDetails is an action to fetch spot details
import { useDispatch, useSelector } from 'react-redux';

function UpdateSpot() {
  const { spotId } = useParams(); // Get the spot ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spotDetails = useSelector(state => state.spots.details); // Get spot details from the store

  const [form, setForm] = useState({
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    neighborhood: '',
    description: '',
    name: '',
    price: '',
    previewImageUrl: '',
    imageUrls: ['', '', '', ''],
  });
  const [errors, ] = useState({});

  useEffect(() => {
    dispatch(loadDetails(spotId)); // Dispatch to load the details of the spot by its ID
  }, [dispatch, spotId]);

  // Set form data when spotDetails are fetched
  useEffect(() => {
    if (spotDetails) {
      setForm({
        country: spotDetails.country || '',
        streetAddress: spotDetails.streetAddress || '',
        city: spotDetails.city || '',
        state: spotDetails.state || '',
        neighborhood: spotDetails.neighborhood || '',
        description: spotDetails.description || '',
        name: spotDetails.name || '',
        price: spotDetails.price || '',
        spotImage: spotDetails.previewImageUrl || '',
        imageUrls: spotDetails.imageUrls || ['', '', '', ''],
      });
    }
  }, [spotDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setForm((prev) => {
      const newImageUrls = [...prev.imageUrls];
      newImageUrls[index] = value;
      return { ...prev, imageUrls: newImageUrls };
    });
  };



  const handleSubmit = (e) => {
    e.preventDefault();   
      dispatch(updateDetails(spotId, form));
      console.log('UpdatedData', form)
      navigate(`/spots/${spotId}`); // Optionally navigate to the spot's detail page
};

  return (
    <div className="createspotform">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where’s your place located?</h2>
          <p>Guests will only get your exact address once they’ve booked a reservation.</p>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={form.streetAddress}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="neighborhood"
            placeholder="Neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Please write at least 30 characters"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <input
            type="text"
            name="name"
            placeholder="Name of your spot"
            value={form.name}
            onChange={handleChange}
          />
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <input
            type="number"
            name="price"
            placeholder="Price per night (USD)"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </section>

        <section>
          <h2>Liven up your spot with photos</h2>
          <input
            type="text"
            name="previewImageUrl"
            placeholder="Preview Image URL"
            value={form.previewImageUrl}
            onChange={handleChange}
          />
          {errors.previewImageUrl && <p className="error">{errors.previewImageUrl}</p>}
          {form.imageUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              placeholder="Image URL"
              value={url}
              onChange={(e) => handleImageChange(e, index)}
            />
          ))}
        </section>

        <button className="createspotbutton" type="submit">Update Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpot;

