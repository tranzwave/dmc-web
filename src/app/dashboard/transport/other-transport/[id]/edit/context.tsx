import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Charges } from '~/components/transports/editTransport/forms/chargesForm/columns';
import { Documents } from '~/components/transports/editTransport/forms/documentsForm/columns';
import { General } from '~/components/transports/editTransport/forms/generalForm/columns';
import { Vehicles } from '~/components/transports/editTransport/forms/vehiclesForm/columns';
import { InsertOtherTransport } from '~/server/db/schemaTypes';

// Define context properties
interface EditOtherTransportContextProps {
  otherTransportDetails: InsertOtherTransport;
  setGeneralDetails: (details: InsertOtherTransport) => void;
}

// Provide default values
const defaultGeneral: InsertOtherTransport = {
  id: "",
  tenantId: "",
  name: "",
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  cityId: 0,
  province: "",
  transportMethod: "",
  vehicleType: "",
  startLocation: "",
  destination: "",
  capacity: 0,
  price: "0",
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultTransportDetails: InsertOtherTransport = defaultGeneral;



const EditOtherTransportContext = createContext<EditOtherTransportContextProps | undefined>(undefined);

export const EditOtherTransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [otherTransportDetails, setOtherTransportDetails] = useState<InsertOtherTransport>(defaultTransportDetails);

  const setGeneralDetails = (details: InsertOtherTransport) => {
    setOtherTransportDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <EditOtherTransportContext.Provider
      value={{
        otherTransportDetails,
        setGeneralDetails,
      
      }}
    >
      {children}
    </EditOtherTransportContext.Provider>
  );
};

// Custom hook to use context
export const useEditOtherTransport = (): EditOtherTransportContextProps => {
  const context = useContext(EditOtherTransportContext);
  if (!context) {
    throw new Error('useEditTransport must be used within an EditTransportProvider');
  }
  return context;
};
