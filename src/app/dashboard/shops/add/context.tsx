import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertShop, InsertShopShopType, SelectCity, SelectShopType } from '~/server/db/schemaTypes'; // Import the activity type definition

export type Shop = InsertShop & {
  city?:SelectCity
  shopTypes?: SelectShopType[]; // Shop can have multiple shop types

}

export type ShopType = InsertShopShopType & {
    shopTypeId: number; // ShopType has a name field
}

export interface ShopDetails {
  general: Shop;
  shopTypes: ShopType[];
}

// Define context properties
interface AddShopContextProps {
  shopDetails: ShopDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: Shop) => void;
  addShopTypes: (shopType: ShopType) => void; // Method to add shop types
  deleteShopType: (typeId: number) => void; 

}

// Provide default values
const defaultGeneral: Shop = {
  name: "",
  streetName: "",
  province: "",
  cityId:0,
  contactNumber:"",
  tenantId:"",
  city:{
    id:0,
    name:'',
    country:''
  }
};

const defaultShopDetails: ShopDetails = {
  general: defaultGeneral,
  shopTypes: [], // Initialize with an empty array
};

const AddShopContext = createContext<AddShopContextProps | undefined>(undefined);

export const AddShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shopDetails, setShopDetails] = useState<ShopDetails>(defaultShopDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const setGeneralDetails = (details: InsertShop) => {
    setShopDetails(prev => ({ ...prev, general: details }));
  };

  const addShopType = (shopType: InsertShopShopType) => {
    setShopDetails((prev) => {
      // Check if the activity already exists in the array by comparing name, activityType, and capacity
      const exists = prev.shopTypes.some(
        (s) =>
          s.shopId === shopType.shopId &&
          s.shopTypeId === shopType.shopTypeId
      );
  
      if (exists) {
        return prev;
      }
  
      // Otherwise, add the new activity to the activities array
      return {
        ...prev,
        shopTypes: [...prev.shopTypes, shopType],
      };
    });
  };

  const deleteShopType = (typeId: number) => {
    alert(typeId)
    setShopDetails(prev => ({
      ...prev,
      shopTypes: prev.shopTypes.filter(shopType => shopType.shopTypeId !== typeId)
    }));
  };

  

  return (
    <AddShopContext.Provider
      value={{
        shopDetails: shopDetails,
        setGeneralDetails,
        addShopTypes: addShopType,
        activeTab,
        setActiveTab,
        deleteShopType
      }}
    >
      {children}
    </AddShopContext.Provider>
  );
};

// Custom hook to use context
export const useAddShop = (): AddShopContextProps => {
  const context = useContext(AddShopContext);
  if (!context) {
    throw new Error('useAddShop must be used within an AddShopProvider');
  }
  return context;
};
