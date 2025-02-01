import React, { createContext, ReactNode, useContext, useState } from "react";
import { Documents } from "~/components/transports/guide/addTransport/forms/documentsForm/columns";
import { General } from "~/components/transports/guide/addTransport/forms/generalForm/columns";

interface TransportDetails {
  general: General;
  documents: Documents;
}

interface AddGuideTransportContextProps {
  transportDetails: TransportDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: General) => void;
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
  type: "z",
  includes: {
    documents: false,
  },
};

const defaultDocuments: Documents = {
  guideLicense: "",
};


const defaultTransportDetails: TransportDetails = {
  general: defaultGeneral,
  documents: defaultDocuments,
};

const AddGuideTransportContext = createContext<AddGuideTransportContextProps | undefined>(
  undefined,
);

export const AddGuideTransportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transportDetails, setTransportDetails] = useState<TransportDetails>(
    defaultTransportDetails,
  );
  const [activeTab, setActiveTab] = useState<string>("general");

  const setGeneralDetails = (details: General) => {
    setTransportDetails((prev) => ({ ...prev, general: details }));
  };


  const setDocumetsDetails = (documents: Documents) => {
    setTransportDetails((prev) => ({ ...prev, documents }));
  };

  return (
    <AddGuideTransportContext.Provider
      value={{
        transportDetails,
        setGeneralDetails,
        setDocumetsDetails,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AddGuideTransportContext.Provider>
  );
};

// Custom hook to use context
export const useAddGuideTransport = (): AddGuideTransportContextProps => {
  const context = useContext(AddGuideTransportContext);
  if (!context) {
    throw new Error(
      "useAddGuideTransport must be used within an AddGuideTransportProvider",
    );
  }
  return context;
};
