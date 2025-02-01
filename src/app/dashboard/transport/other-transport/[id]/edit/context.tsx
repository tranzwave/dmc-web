import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Charges } from '~/components/transports/editTransport/forms/chargesForm/columns';
import { Documents } from '~/components/transports/editTransport/forms/documentsForm/columns';
import { General } from '~/components/transports/editTransport/forms/generalForm/columns';
import { Vehicles } from '~/components/transports/editTransport/forms/vehiclesForm/columns';

interface TransportDetails {
  general: General; 
  vehicles: Vehicles[];
  charges: Charges;
  documents: Documents;
}

// Define context properties
interface EditTransportContextProps {
  transportDetails: TransportDetails;
  setGeneralDetails: (details: General) => void;
  addVehicles: (vehicles: Vehicles) => void;
  setChargesDetails: (charges: Charges) => void;
  setDocumetsDetails: (documents: Documents) => void;
}

// Provide default values
const defaultGeneral: General = {
  name: "",
  language: "",
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  city: "",
  province: "",
  guid: "",
  includes: {
    vehicles: false,
    charges: false,
    documents: false,
  },
};

const defaultCharges: Charges = {
  feePerKm: 0,
  fuelAllowance: 0,
  accommodationAllowance: 0,
  mealAllowance: 0,
}

const defaultDocuments: Documents = {
  driverLicense: "",
  guideLicense: "",
  vehicleEmissionTest: "",
  insurance: ""
}

const defaultTransportDetails: TransportDetails = {
  general: defaultGeneral,
  vehicles: [],
  charges: defaultCharges,
  documents: defaultDocuments,
};



const EditTransportContext = createContext<EditTransportContextProps | undefined>(undefined);

export const EditTransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transportDetails, setTransportDetails] = useState<TransportDetails>(defaultTransportDetails);

  const setGeneralDetails = (details: General) => {
    setTransportDetails(prev => ({ ...prev, general: details }));
  };

  const addVehicles = (vehicles: Vehicles) => {
    setTransportDetails(prev => ({ ...prev, vehicles: [...prev.vehicles, vehicles] }));
  };

  const setChargesDetails = (charges: Charges) => {
    setTransportDetails(prev => ({ ...prev, charges:  charges }));
  };


  const setDocumetsDetails = (documents: Documents) => {
    setTransportDetails(prev => ({ ...prev, documents: documents }));
  };

  return (
    <EditTransportContext.Provider
      value={{
        transportDetails,
        setGeneralDetails,
        addVehicles,
        setChargesDetails,
        setDocumetsDetails,
      
      }}
    >
      {children}
    </EditTransportContext.Provider>
  );
};

// Custom hook to use context
export const useEditTransport = (): EditTransportContextProps => {
  const context = useContext(EditTransportContext);
  if (!context) {
    throw new Error('useEditTransport must be used within an EditTransportProvider');
  }
  return context;
};
