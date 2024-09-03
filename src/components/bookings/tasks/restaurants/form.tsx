// RestaurantsForm.tsx
import React, { useState } from 'react'; // Adjust import based on your project structure
import { RestaurantVoucherData } from '.';

interface RestaurantsFormProps {
  selectedItem: RestaurantVoucherData | undefined; // Ensures it matches the expected type
  onSave: () => void; // Callback for when saving
}

const RestaurantsForm: React.FC<RestaurantsFormProps> = ({ selectedItem, onSave }) => {
  const [restaurantData, setRestaurantData] = useState<RestaurantVoucherData | undefined>(selectedItem);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRestaurantData(prevData => ({
      ...prevData!,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form submission logic here
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="restaurantName">Restaurant Name</label>
        <input
          type="text"
          id="restaurantName"
          name="restaurantName"
          value={restaurantData?.restaurant.name || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={restaurantData?.restaurant.contactNumber || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={restaurantData?.restaurant.cityId || ''}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default RestaurantsForm;
