// HotelsForm.tsx
import React from 'react';
import { HotelVoucherData } from '../../hotels';

interface HotelsFormProps {
  selectedItem: HotelVoucherData | undefined; // Ensures it matches the expected type
  onSave: () => void; // Ensures it matches the expected type
}

const HotelsForm: React.FC<HotelsFormProps> = ({ selectedItem, onSave }) => {
  // Form logic and UI here

  const handleSubmit = () => {
    // Handle form submission
    onSave();
  };

  return (
    <form>
      {/* Form fields that use selectedItem */}
      <button type="button" onClick={handleSubmit}>Save</button>
    </form>
  );
};

export default HotelsForm;
