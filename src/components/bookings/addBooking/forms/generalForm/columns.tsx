"use client";


export type General = {
  clientName: string;
  country:string;
  directCustomer:boolean;

  adultsCount: number,
  kidsCount: number,
  startDate: string;
  numberOfDays: number;
  endDate: string;
  marketingManager: string;
  marketingTeam: string | null;
  
  tourType: string;
  includes: {
    hotels: boolean;
    restaurants: boolean,
    activities: boolean;
    transport: boolean;
    shops:boolean,
  };
  primaryEmail?: string;
  primaryContactNumber?:string;
  agent?: string;
};