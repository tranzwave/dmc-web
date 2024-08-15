import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Charges } from '~/components/transports/addTransport/forms/chargesForm/columns';
import { Documents } from '~/components/transports/addTransport/forms/documentsForm/columns';
import { General } from '~/components/transports/addTransport/forms/generalForm/columns';
import { Vehicles } from '~/components/transports/addTransport/forms/vehiclesForm/columns';

interface TransportDetails {
  general: General; 
  vehicles: Vehicles[];
  charges: Charges[];
  documents: Documents[];
}

// Define context properties
interface AddTransportContextProps {
  transportDetails: TransportDetails;
  setGeneralDetails: (details: General) => void;
  addVehicles: (vehicles: Vehicles) => void;
  addCharges: (charges: Charges) => void;
  addDocumets: (documents: Documents) => void;
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

const defaultTransportDetails: TransportDetails = {
  general: defaultGeneral,
  vehicles: [],
  charges: [],
  documents: [],
};

const AddTransportContext = createContext<AddTransportContextProps | undefined>(undefined);

export const AddTransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transportDetails, setTransportDetails] = useState<TransportDetails>(defaultTransportDetails);

  const setGeneralDetails = (details: General) => {
    setTransportDetails(prev => ({ ...prev, general: details }));
  };

  const addVehicles = (vehicles: Vehicles) => {
    setTransportDetails(prev => ({ ...prev, vehicles: [...prev.vehicles, vehicles] }));
  };

  const addCharges = (charges: Charges) => {
    setTransportDetails(prev => ({ ...prev, charges: [...prev.charges, charges] }));
  };


  const addDocumets = (documents: Documents) => {
    setTransportDetails(prev => ({ ...prev, documents: [...prev.documents, documents] }));
  };

  return (
    <AddTransportContext.Provider
      value={{
        transportDetails,
        setGeneralDetails,
        addVehicles,
        addCharges,
        addDocumets,
      
      }}
    >
      {children}
    </AddTransportContext.Provider>
  );
};

// Custom hook to use context
export const useAddTransport = (): AddTransportContextProps => {
  const context = useContext(AddTransportContext);
  if (!context) {
    throw new Error('useAddTransport must be used within an AddTransportProvider');
  }
  return context;
};
