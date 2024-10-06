import React, { createContext, useContext, useState, ReactNode } from "react";
import type { OrganizationResource } from "@clerk/types";

// Define the type for the context state
interface OrganizationContextType {
  organization: OrganizationResource | null; // Use null to indicate absence of an organization
  setOrganization: React.Dispatch<React.SetStateAction<OrganizationResource | null>>;
}

// Create the context with a default value of null
const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Define a custom provider component that accepts initial organization data
export const OrganizationProvider: React.FC<{ children: ReactNode; initialOrg: OrganizationResource | null }> = ({
  children,
  initialOrg,
}) => {
  // Create a state to manage the organization data
  const [organization, setOrganization] = useState<OrganizationResource | null>(initialOrg);

  // Context value to pass down to consuming components
  const value = { organization, setOrganization };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

// Custom hook to use the organization context
export const useOrganization = (): OrganizationResource | null => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context.organization;
};

// Custom hook to update organization context
export const useUpdateOrganization = (): React.Dispatch<React.SetStateAction<OrganizationResource | null>> => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useUpdateOrganization must be used within an OrganizationProvider");
  }
  return context.setOrganization;
};
