import React, { createContext, useContext, useState, ReactNode } from "react";
import { Permissions } from "~/lib/types/global";

// Define the type for the context state
interface UserPermissionsContextType {
  permissions: Permissions[];
  setPermissions: React.Dispatch<React.SetStateAction<Permissions[]>>;
}

// Create the context
const UserPermissionsContext = createContext<UserPermissionsContextType | undefined>(undefined);

// Provider component
export const UserPermissionsProvider: React.FC<{
  children: ReactNode;
  initialPermissions: Permissions[];
}> = ({ children, initialPermissions }) => {
  const [permissions, setPermissions] = useState<Permissions[]>(initialPermissions || []);
  const value = { permissions, setPermissions };

  return (
    <UserPermissionsContext.Provider value={value}>
      {children}
    </UserPermissionsContext.Provider>
  );
};

// Custom hook to access permissions
export const useUserPermissions = () => {
  const context = useContext(UserPermissionsContext);
  if (!context) {
    throw new Error("useUserPermissions must be used within a UserPermissionsProvider");
  }
  return context.permissions;
};
