import React, { createContext, ReactNode, useContext, useState } from 'react';
import { General } from '~/components/agents/addAgent/forms/generalForm/columns';

interface AgentDetails {
  general: General; 
}

// Define context properties
interface AddAgentContextProps {
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

const AddAgentContext = createContext<AddAgentContextProps | undefined>(undefined);

export const AddAgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agentDetails, setAgentDetails] = useState<AgentDetails>(defaultAgentDetails);

  const setGeneralDetails = (details: General) => {
    setAgentDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <AddAgentContext.Provider
      value={{
        agentDetails: agentDetails,
        setGeneralDetails
      }}
    >
      {children}
    </AddAgentContext.Provider>
  );
};

// Custom hook to use context
export const useAddAgent = (): AddAgentContextProps => {
  const context = useContext(AddAgentContext);
  if (!context) {
    throw new Error('useAddAgent must be used within an AddAgentProvider');
  }
  return context;
};
