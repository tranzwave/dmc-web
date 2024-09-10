"use client";


export type General = {
  clientName: string;
  country:string;
  primaryEmail: string;
  adultsCount: number,
  kidsCount: number,
  startDate: string;
  numberOfDays: number;
  endDate: string;
  marketingManager: string;
  agent: string;
  tourType: string;
  includes: {
    hotels: boolean;
    restaurants: boolean,
    activities: boolean;
    transport: boolean;
    shops:boolean,
  };
};