import { and, eq } from "drizzle-orm";
import { DB } from "..";
import cities from './data/cities.json'
import { country,city } from "../schema";
import { Country, State, City, ICity }  from 'country-state-city';

export default async function seed(db:DB) {

  const SriLankancCities = City.getCitiesOfCountry("LK")
  const SeychelleCities = City.getCitiesOfCountry("SC")
  let allCities:ICity[] = []

  if(SriLankancCities && SeychelleCities){
    allCities = [...SriLankancCities, ...SeychelleCities]
  }

    // Fetch or create countries
    // const countries = await Promise.all(
    //   cities.map(async (currentCity) => {
    //     const foundCountry = await db.query.country.findFirst({
    //       where: eq(country.code, currentCity.country),
    //     });
  
    //     if (!foundCountry) {
    //       // Create a new country if it does not exist
    //       const newCountryCode = await db.insert(country).values(
    //         {
    //             "name": `${currentCity.country}-C`,
    //             "code": currentCity.country
    //         },
    //       ).returning({
    //         code: country.code
    //       });
  
    //       return newCountryCode[0]?.code;
    //     }
  
    //     return foundCountry.code;
    //   })
    // );


    // Flatten country IDs array
    const countryCodes = ["LK", "SC"]; // Remove duplicates

    // Fetch or create cities
    await Promise.all(
      allCities.map(async (currentCity) => {
        const countryCode = countryCodes.find(code => code === currentCity.countryCode);
  
        if (!countryCode) {
          throw new Error("Country not found for city: " + currentCity.countryCode);
        }
  
        // Check if city already exists
        const foundCity = await db.query.city.findFirst({
          where: and(eq(city.name, currentCity.name),eq(city.country,currentCity.countryCode)),
        });
  
        if (!foundCity) {
          // Create a new city if it does not exist
          await db.insert(city).values({
            "country" : currentCity.countryCode,
            "name" : currentCity.name,
          });
        }
      })
    );

}