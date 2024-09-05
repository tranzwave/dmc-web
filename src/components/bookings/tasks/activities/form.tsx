// HotelsForm.tsx
import React from 'react';
import { ActivityVoucherData } from '.';

interface ActivityVoucherFormProps {
  selectedItem: ActivityVoucherData | undefined; // Ensures it matches the expected type
  onSave: () => void; // Ensures it matches the expected type
}

const ActivityForm: React.FC<ActivityVoucherFormProps> = ({ selectedItem, onSave }) => {
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

export default ActivityForm;
