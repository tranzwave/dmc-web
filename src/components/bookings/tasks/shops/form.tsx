// ShopsForm.tsx
import React from 'react';
import { ShopVoucherData } from '.';

interface ShopsFormProps {
  selectedItem: ShopVoucherData | undefined;
  onSave: () => void;
}

const ShopsForm: React.FC<ShopsFormProps> = ({ selectedItem, onSave }) => {
  // Form logic and UI here

  const handleSubmit = () => {
    // Handle form submission
    onSave();
  };

  return (
    <div></div>
  );
};

export default ShopsForm;
