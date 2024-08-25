import { and, eq } from "drizzle-orm";
import { DB } from "..";
import restaurants from './data/restaurants.json'
import { city, hotel, restaurant, restaurantMeal, tenant } from "../schema";

export default async function seed(db: DB) {
  // Fetch tenants
  const tenant = await db.query.tenant.findFirst();

  if (!tenant) {
    throw new Error("No tenants found");
  }

  // Fetch or create cities
  const cities = await Promise.all(
    restaurants.map(async (entry) => {
      const currentRestaurant = entry.restaurant;

      const foundCity = await db.query.city.findFirst({
        where: eq(city.name, currentRestaurant.city),
      });

      if (!foundCity) {
        // Create a new city if it does not exist
        const tenantCountry = tenant.country;
        if (!tenantCountry) {
          throw new Error(`No country found for tenant: ${currentRestaurant.tenantId}`);
        }
        const newCity = await db.insert(city).values({
          name: currentRestaurant.city,
          country: tenantCountry
        }).returning({             
            id: city.id,
            name: city.name });

        return newCity[0];
      }

      return foundCity;
    })
  );

  // Flatten cities array
  const citiesList = [...new Set(cities)]; // Remove duplicates

  console.log(citiesList);

  await Promise.all(
    restaurants.map(async (entry) => {
      const currentRestaurant = entry.restaurant;
      const restaurantMeals = entry.restaurantMeals;

      const cityObject = citiesList.find(city => city?.name === currentRestaurant.city);

      if (!cityObject) {
        throw new Error("City not found for restaurant: " + currentRestaurant.city);
      }

      // Check if restaurant already exists
      const foundRestaurant = await db.query.restaurant.findFirst({
        where: and(
          eq(restaurant.tenantId, currentRestaurant.tenantId),
          eq(restaurant.cityId, cityObject.id),
          eq(restaurant.name, currentRestaurant.name)
        ),
      });

      if (!foundRestaurant) {
        // Create a new restaurant if it does not exist
        const newRestaurantId = await db.insert(restaurant).values({
          ...currentRestaurant,
          tenantId: tenant.id,
          cityId: cityObject.id,
        }).returning({ id: restaurant.id });

        if (!newRestaurantId[0]) {
          throw new Error(`Couldn't add restaurant: ${currentRestaurant.name}`);
        }

        // Add restaurant meals
        await db.insert(restaurantMeal).values(
          restaurantMeals.map((meal) => ({
            ...meal,
            restaurantId: newRestaurantId[0]?.id || meal.restaurantId
          }))
        );
      }
    })
  );
}
