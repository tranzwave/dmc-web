"use server";
import { eq } from "drizzle-orm";
import { db } from "../..";
import { city } from "../../schema";

export const getAllCities = (countryCode: string) => {
  return db.query.city.findMany({
    where: eq(city.country, countryCode),
  });
};

export const getCityById = (id: number) => {
  return db.query.city.findFirst({
    where: eq(city.id, id),
  });
};

export const getCityByName = (name: string) => {
  return db.query.city.findFirst({
    where: eq(city.name, name),
  });
};

export const createCity = (name: string, country: string) => {
  return db.insert(city).values({
    name,
    country,
  }).returning();
};

export const updateCity = (id: number, name: string) => {
  return db.update(city).set({
    name,
  }).where(eq(city.id, id));
};

export const deleteCity = (id: number) => {
  return db.delete(city).where(eq(city.id, id));
};
