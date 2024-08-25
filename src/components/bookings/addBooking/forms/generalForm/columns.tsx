"use client";


export type General = {
  clientName: string;
  primaryEmail: string;
  startDate: string;
  numberOfDays: number;
  endDate: string;
  marketingManager: string;
  agent: string;
  tourType: string;
  includes: {
    hotels: boolean;
    transport: boolean;
    activities: boolean;
  };
};