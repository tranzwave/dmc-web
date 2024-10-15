"use client";


export type General = {
  name: string;
  language: string;
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
