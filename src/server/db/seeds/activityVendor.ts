import { and, eq } from "drizzle-orm";
import { DB } from "..";
import {
  activity,
  activityType,
  activityVendor,
  city
} from "../schema";
import vendors from "./data/activities.json";

export default async function seed(db: DB) {
  // Fetch tenants
  const foundTenant = await db.query.tenant.findFirst();

  if (!foundTenant) {
    throw new Error("No tenants found");
  }

  // Fetch or create cities
  const citiesMap = new Map<string, { id: number; name: string }>();
  for (const currentVendor of vendors) {
    const cityName = currentVendor.city;
    if (!citiesMap.has(cityName)) {
      const foundCity = await db.query.city.findFirst({
        where: eq(city.name, cityName),
      });

      if (!foundCity) {
        const newCity = await db
          .insert(city)
          .values({
            name: cityName,
            country: foundTenant.country,
          })
          .returning({
            id: city.id,
            name: city.name,
          });

        if (!newCity[0]) {
          throw new Error("Couldn't add new city " + cityName);
        }
        citiesMap.set(cityName, newCity[0]);
      } else {
        citiesMap.set(cityName, foundCity);
      }
    }
  }

  // Fetch or create activity type
  const activityTypesMap = new Map<string, { id: number, name: string }>();
  for (const currentVendor of vendors) {
    for (const act of currentVendor.activities) {
      if (!activityTypesMap.has(act.name)) {
        const foundActivityType = await db.query.activityType.findFirst({
          where: eq(activityType.name, act.name),
        });

        if (!foundActivityType) {
          const newActivity = await db.insert(activityType).values({
            name: act.name
          }).returning({
            id: activityType.id,
            name: activityType.name
          });
          if (!newActivity[0]) {
            throw new Error("Couldn't add new activity " + act.name)
          }
          activityTypesMap.set(act.name, newActivity[0]);
        } else {
          activityTypesMap.set(act.name, foundActivityType);
        }
      }
    }
  }

  // Process vendors and activities
  for (const currentVendor of vendors) {
    const cityObject = citiesMap.get(currentVendor.city);
    if (!cityObject) {
      throw new Error("City not found for driver: " + currentVendor.city);
    }

    const foundVendor = await db.query.activityVendor.findFirst({
      where: and(
        eq(activityVendor.tenantId, foundTenant.id),
        eq(activityVendor.cityId, cityObject.id),
        eq(activityVendor.contactNumber, currentVendor.contactNumber)
      ),
    });

    if (!foundVendor) {
      const newVendorId = await db.insert(activityVendor).values({
        ...currentVendor,
        tenantId: foundTenant.id,
        cityId: cityObject.id,
      }).returning({
        id: activityVendor.id,
      });

      if (!newVendorId[0]) {
        throw new Error(`Couldn't add driver: ${currentVendor.name}`);
      }

      //Add activities to vendor
      await db.insert(activity).values(
        currentVendor.activities.map((act) => ({
          ...act,
          tenantId: foundTenant.id,
          activityVendorId: newVendorId[0]?.id ?? "",
          activityType: activityTypesMap.get(act.name)?.id ?? 0
        }))
      );
    }
  }


}
