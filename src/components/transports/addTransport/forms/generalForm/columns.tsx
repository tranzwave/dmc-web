"use client";


export type General = {
  name: string;
  language: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  city: string;
  province: string;
  guide: boolean;
  includes: {
    vehicles: boolean,
    charges: boolean,
    documents: boolean,
  }
};
