import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './createspot.css';

function CreateASpot() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        country: '',
        streetAddress: '',
        city: '',
        state: '',
        neighborhood: '',
        description: '',
        title: '',
        price: '',
        previewImageUrl: '',
        imageUrls: ['', '', '', ''],
      });
      const [errors, setErrors] = useState({});
    
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
        if (!form.previewImageUrl) newErrors.previewImageUrl = "Preview Image URL is required";
        if (!form.price) newErrors.price = "Price per night is required";
        if (form.description.length < 30) newErrors.description = "Description needs 30 or more characters";
        // Add more validations as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
          // Submit the form data to your backend API
          const response = await fetch('/api/spots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          if (response.ok) {
            const newSpot = await response.json();
           navigate(`/spots/${newSpot.id}`); // Navigate to the new spot's detail page
          }
        }
      };
    
      return (
        <div className="createspotform">
          <h1>Create a New Spot</h1>
          <form onSubmit={handleSubmit}>
            <section>
              <h2>Wheres your place located?</h2>
              <p>Guests will only get your exact address once they booked a reservation.</p>
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
              <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
              <input 
                type="text" 
                name="title" 
                placeholder="Name of your spot" 
                value={form.title} 
                onChange={handleChange} 
              />
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