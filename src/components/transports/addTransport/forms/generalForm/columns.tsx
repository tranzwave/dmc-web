"use client";

import { SelectLanguage } from "~/server/db/schemaTypes";


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
    vehicles: boolean,
    charges: boolean,
    documents: boolean,
  }
};
