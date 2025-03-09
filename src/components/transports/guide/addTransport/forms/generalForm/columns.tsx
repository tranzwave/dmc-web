"use client";


export type General = {
  name: string;
  languages: string[];
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  city: string;
  province: string;
  type: string;
  includes: {
    documents: boolean,
  }
};
