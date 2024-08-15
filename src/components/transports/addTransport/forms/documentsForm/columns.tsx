"use client";


export type Documents = {
  name: string;
  language: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  city: string;
  province: string;
  guid: string;
  includes: {
    vehicles: boolean,
    charges: boolean,
    documents: boolean,
  }
};
