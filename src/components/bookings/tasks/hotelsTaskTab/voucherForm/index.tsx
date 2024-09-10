// HotelsForm.tsx
import React from 'react';
import { HotelVoucherData } from '..';
import HotelsForm from '~/components/bookings/addBooking/forms/hotelsForm/hotelsForm';
import { SelectHotelVoucherLine } from '~/server/db/schemaTypes';

interface HotelsFormProps {
  selectedItem: SelectHotelVoucherLine | undefined; // Ensures it matches the expected type
  onSave: () => void; // Ensures it matches the expected type
}

const HotelsVoucherForm: React.FC<HotelsFormProps> = ({ selectedItem, onSave }) => {
  // Form logic and UI here

  const handleSubmit = () => {
    // Handle form submission
    onSave();
  };

  return (
    <HotelsForm defaultValues={selectedItem ?? null} 
    hotels={[]} 
    onAddHotel={()=>{console.log("cant add here")}}
    />
    );
};

export default HotelsVoucherForm;
