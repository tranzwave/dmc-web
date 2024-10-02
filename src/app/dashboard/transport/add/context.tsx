import React, { createContext, ReactNode, useContext, useState } from "react";
import { Charges } from "~/components/transports/addTransport/forms/chargesForm/columns";
import { Documents } from "~/components/transports/addTransport/forms/documentsForm/columns";
import { General } from "~/components/transports/addTransport/forms/generalForm/columns";
import { Vehicles } from "~/components/transports/addTransport/forms/vehiclesForm/columns";

interface TransportDetails {
  general: General;
  vehicles: Vehicles[];
  charges: Charges;
  documents: Documents;
}

interface AddTransportContextProps {
  transportDetails: TransportDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: General) => void;
  addVehicles: (vehicles: Vehicles) => void;
  deleteVehicle: (numberPlate: string) => void;
  setChargesDetails: (charges: Charges) => void;
  setDocumetsDetails: (documents: Documents) => void;
}

const defaultGeneral: General = {
  name: "",
  language: "",
  primaryEmail: "",
  primaryContactNumber: "",
  streetName: "",
  city: "",
  province: "",
  type: "",
  includes: {
    vehicles: false,
    charges: false,
    documents: false,
  },
};

const defaultCharges: Charges = {
  feePerKm: 1,
  feePerDay: 1,
  fuelAllowance: 2000,
  accommodationAllowance: 1,
  mealAllowance: 1,
};

const defaultDocuments: Documents = {
  driverLicense: "N/A",
  guideLicense: "N/A",
  vehicleEmissionTest: "N/A",
  insurance: "N/A",
};

const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};


const defaultTransportDetails: TransportDetails = {
  general: defaultGeneral,
  vehicles: [
    {
      make: "N/A",
      model: "N/A",
      year: "2024",
      vehicle: "N/A",
      numberPlate: generateRandomString(7),
      seats: 1,
      vrl: "N/A",
    },
  ],
  charges: defaultCharges,
  documents: defaultDocuments,
};

const AddTransportContext = createContext<AddTransportContextProps | undefined>(
  undefined,
);

export const AddTransportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transportDetails, setTransportDetails] = useState<TransportDetails>(
    defaultTransportDetails,
  );
  const [activeTab, setActiveTab] = useState<string>("general");

  const setGeneralDetails = (details: General) => {
    setTransportDetails((prev) => ({ ...prev, general: details }));
  };

  const addVehicles = (vehicles: Vehicles) => {
    const foundVehicle = transportDetails.vehicles.find(
      (v) => v.numberPlate === vehicles.numberPlate,
    );
    if (foundVehicle) {
      const prevVehicles = transportDetails.vehicles.filter(
        (v) => v.numberPlate !== vehicles.numberPlate,
      );
      prevVehicles.push(vehicles);
      setTransportDetails((prev) => ({ ...prev, vehicles: prevVehicles }));
      return;
    }
    setTransportDetails((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, vehicles],
    }));
  };

  const deleteVehicle = (numberPlate: string) => {
    alert(numberPlate);
    setTransportDetails((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter(
        (vehicle) => vehicle.numberPlate !== numberPlate,
      ),
    }));
  };

  const setChargesDetails = (charges: Charges) => {
    setTransportDetails((prev) => ({ ...prev, charges }));
  };

  const setDocumetsDetails = (documents: Documents) => {
    setTransportDetails((prev) => ({ ...prev, documents }));
  };

  return (
    <AddTransportContext.Provider
      value={{
        transportDetails,
        setGeneralDetails,
        addVehicles,
        deleteVehicle,
        setChargesDetails,
        setDocumetsDetails,
        activeTab,
        setActiveTab,
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
    throw new Error(
      "useAddTransport must be used within an AddTransportProvider",
    );
  }
  return context;
};
