import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InsertShop, InsertShopShopType, SelectCity, SelectShopType } from '~/server/db/schemaTypes'; // Import the activity type definition

export type Shop = InsertShop & {
  city?:SelectCity
  shopTypes?: SelectShopType[];

}

export type ShopType = InsertShopShopType & {
    shopTypeId: number; 
}

export interface ShopDetails {
  general: Shop;
}

interface AddShopContextProps {
  shopDetails: ShopDetails;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setGeneralDetails: (details: Shop) => void;
}

const defaultGeneral: Shop = {
  name: "",
  streetName: "",
  province: "",
  cityId:0,
  contactNumber:"",
  tenantId:"",
  shopTypes:[],
  city:{
    id:0,
    name:'',
    country:''
  }
};

const defaultShopDetails: ShopDetails = {
  general: defaultGeneral,
};

const AddShopContext = createContext<AddShopContextProps | undefined>(undefined);

export const AddShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shopDetails, setShopDetails] = useState<ShopDetails>(defaultShopDetails);
  const [activeTab, setActiveTab] = useState<string>("general");
  const setGeneralDetails = (details: InsertShop) => {
    setShopDetails(prev => ({ ...prev, general: details }));
  };

  return (
    <AddShopContext.Provider
      value={{
        shopDetails: shopDetails,
        setGeneralDetails,
        activeTab,
        setActiveTab,
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
