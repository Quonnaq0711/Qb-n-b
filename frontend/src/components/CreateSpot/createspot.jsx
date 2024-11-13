import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createASpot, setSpots } from "../../store/landingPage"; // Assuming your createSpot action is defined here
import './createspot.css';

function CreateASpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    description: '',
    title: '',
    price: '',
    previewImageUrl: '',
    imageUrls: ['', '', '', ''],
  });
  const currentUser = useSelector(state => state.session.user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(setSpots()); // Dispatch to load the details of the spot by its ID
  }, [dispatch]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.previewImageUrl) newErrors.previewImageUrl = "Preview Image URL is required";
    if (!form.price) newErrors.price = "Price per night is required";
    if (form.description.length < 30) newErrors.description = "Description needs 30 or more characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const spotData = {
        ownerId: currentUser.id, // Assuming you have the `currentUser.id`
        country: form.country,
        address: form.streetAddress,
        city: form.city,
        state: form.state,
        description: form.description,
        name: form.title,
        price: parseInt(form.price, 10),
        previewImageUrl: form.previewImageUrl,
        imageUrls: form.imageUrls,
      };

      try {
        // Dispatch the createSpot action
        const newSpot = await dispatch(createASpot(spotData));

        if (newSpot && newSpot.id) {
          navigate(`/spots/${newSpot.id}`); // Navigate to the newly created spot's detail page
        }
      } catch (err) {
        console.error("Error creating spot:", err);
        // Optionally handle error if spot creation fails
      }
    }
  };

  return (
    <div className="createspot">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where is your place located?</h2>
          <p>Guests will only get your exact address once they have booked a reservation.</p>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          {errors.country && <p className="error">{errors.country}</p>}
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={form.streetAddress}
            onChange={handleChange}
          />
          {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
          {errors.state && <p className="error">{errors.state}</p>}
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
          <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
          <input
            type="text"
            name="title"
            placeholder="Name of your spot"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
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
          <p>Submit a link to at least one photo to publish your spot.</p>
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

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateASpot;

