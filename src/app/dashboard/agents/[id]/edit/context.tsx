import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/agents/editAgent/forms/generalForm/columns';

interface AgentDetails {
  general: General; 
}

// Define context properties
interface EditAgentContextProps {
  agentDetails: AgentDetails;
  setGeneralDetails: (details: General) => void;
}

// Provide default values
const defaultGeneral: General = {
  name: "",
  country: "",
  primaryEmail: "",
  primaryContactNumber: "",
  agency: "",
  feild1: "",
  feild2: "",
  feild3: "",
};

const defaultAgentDetails: AgentDetails = {
  general: defaultGeneral,
};

const EditAgentContext = createContext<EditAgentContextProps | undefined>(undefined);

export const EditAgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agentDetails, setAgentDetails] = useState<AgentDetails>(defaultAgentDetails);

  const setGeneralDetails = (details: General) => {
    setAgentDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <EditAgentContext.Provider
      value={{
        agentDetails: agentDetails,
        setGeneralDetails
      }}
    >
      {children}
    </EditAgentContext.Provider>
  );
};

// Custom hook to use context
export const useEditAgent = (): EditAgentContextProps => {
  const context = useContext(EditAgentContext);
  if (!context) {
    throw new Error('useEditAgent must be used within an EditAgentProvider');
  }
  return context;
};
