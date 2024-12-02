import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSpotImage, newSpot } from "../../store/landingPage";
import { nanoid } from 'nanoid';
import './createspot.css';

function CreateASpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [ setImagePreviews, ] = useState([]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image URL changes in the image input fields
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    if (isValidImageUrl(value)) {
      setImagePreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = value;
        return newPreviews;
      });
    }
  };

  // Helper function to check for valid image URLs
  const isValidImageUrl = (url) => {
    const regex = /\.(jpg|jpeg|png|gif|bmp)$/i;
    return regex.test(url);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required field checks
    if (!form.title) newErrors.title = "Title is required";
    if (!form.streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.price) newErrors.price = "Price per night is required";
    if (form.description.length < 30 ) newErrors.description = "Description needs 30 or more characters";
    if (!form.previewImageUrl) newErrors.previewImageUrl = "Preview Image URL is required and must be a valid image URL";

    // Validate additional image URLs
    form.imageUrls.forEach((url, index) => {
      if (url && !isValidImageUrl(url)) {
        newErrors[`imageUrls[${index}]`] = `Image ${index + 1} must be a valid image URL`;
      }
    });
    console.log('?',form.previewImageUrl)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return false if any errors exist
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});  // Clear errors before submission
    if (validateForm()) {
      setIsSubmitting(true);  // Disable submit button during submission
  
      const spotData = {
        id: nanoid(),
        ownerId: currentUser.id,
        country: form.country,
        address: form.streetAddress,
        city: form.city,
        state: form.state,
        description: form.description,
        name: form.title,
        price: parseInt(form.price, 10),
        spotImage: form.previewImageUrl,  // Assuming this is a string for the preview image
      };
  
      try {
        // Dispatch action to create the spot
        const createdSpot = await dispatch(newSpot(spotData));
        if (createdSpot && createdSpot.id) {
          // Handle image upload for preview image
          await dispatch(addSpotImage(createdSpot.id, form.previewImageUrl, true));
  
          // Filter out empty image URLs and upload additional images
          const validImageUrls = form.imageUrls.filter(isValidImageUrl);
          for (const imageUrl of validImageUrls) {
            await dispatch(addSpotImage(createdSpot.id, imageUrl, false));
          }
  
          // Navigate to the new spot page
          navigate(`/spots/${createdSpot.id}`);
        }
      } catch (err) {
        console.error("Error creating spot:", err);
      } finally {
        setIsSubmitting(false);  // Re-enable submit button
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
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageChange(e, index)}
                />
                {errors[`imageUrls[${index}]`] && <p className="error">{errors[`imageUrls[${index}]`]}</p>}
              </div>
            ))}
          </section>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Spot...' : 'Create Spot'}
          </button>
        </form>
      </div>
    );
  }


export default CreateASpot;


