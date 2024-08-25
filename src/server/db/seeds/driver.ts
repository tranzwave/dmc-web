import { and, eq } from "drizzle-orm";
import { DB } from "..";
import hotels from './data/hotels.json';
import drivers from './data/drivers.json';
import languages from './data/languages.json';
import { city, tenant, driver, vehicle, language, driverVehicle, driverLanguage } from "../schema";

export default async function seed(db: DB) {
    // Fetch a tenant
    const foundTenant = await db.query.tenant.findFirst();

    if (!foundTenant) {
        throw new Error("Couldn't find any tenant");
    }

    // Fetch or create cities
    const citiesMap = new Map<string, { id: number, name: string }>();
    for (const currentDriver of drivers) {
        const cityName = currentDriver.driver.city;
        if (!citiesMap.has(cityName)) {
            const foundCity = await db.query.city.findFirst({
                where: eq(city.name, cityName),
            });

            if (!foundCity) {
                const newCity = await db.insert(city).values({
                    name: cityName,
                    country: foundTenant.country,
                }).returning({
                    id: city.id,
                    name: city.name,
                });

                if(!newCity[0]){
                    throw new Error("Couldn't add new city " + cityName)
                }
                citiesMap.set(cityName, newCity[0]);
            } else {
                citiesMap.set(cityName, foundCity);
            }
        }
    }

    // Fetch or create languages
    const languagesMap = new Map<string, { id: number, name: string, code:string }>();
    for (const currentDriver of drivers) {
        for (const lang of currentDriver.driver.languages) {
            if (!languagesMap.has(lang)) {
                const foundLanguage = await db.query.language.findFirst({
                    where: eq(language.name, lang),
                });

                if (!foundLanguage) {
                    const newLanguage = await db.insert(language).values({
                        name: lang,
                        code: lang.substring(0, 3).toLowerCase(),
                    }).returning({
                        id: language.id,
                        name: language.name,
                        code:language.code
                    });
                    if(!newLanguage[0]){
                        throw new Error("Couldn't add new city " + lang)
                    }
                    languagesMap.set(lang, newLanguage[0]);
                } else {
                    languagesMap.set(lang, foundLanguage);
                }
            }
        }
    }

    // Process drivers and vehicles
    for (const currentDriver of drivers) {
        const cityObject = citiesMap.get(currentDriver.driver.city);
        if (!cityObject) {
            throw new Error("City not found for driver: " + currentDriver.driver.city);
        }

        const foundDriver = await db.query.driver.findFirst({
            where: and(
                eq(driver.tenantId, foundTenant.id),
                eq(driver.cityId, cityObject.id),
                eq(driver.primaryEmail, currentDriver.driver.primaryEmail)
            ),
        });

        if (!foundDriver) {
            const newDriverId = await db.insert(driver).values({
                ...currentDriver.driver,
                tenantId: foundTenant.id,
                cityId: cityObject.id,
            }).returning({
                id: driver.id,
            });

            if (!newDriverId[0]) {
                throw new Error(`Couldn't add driver: ${currentDriver.driver.name}`);
            }

            const addedVehicles = await db.insert(vehicle).values(
                currentDriver.vehicles.map(v => ({
                    ...v,
                    "tenantId": foundTenant.id, // Assuming vehicles belong to the same tenant
                }))
            ).returning({
                id: vehicle.id,
            });

            if (!addedVehicles.length) {
                throw new Error("Couldn't add vehicles");
            }

            // Add driver-vehicle relationships
            await db.insert(driverVehicle).values(
                addedVehicles.map((vhcle) => ({
                    vehicleId: vhcle.id,
                    driverId: newDriverId[0]?.id ?? "",
                }))
            );

            // Link driver with languages
            const driverLanguageLinks = currentDriver.driver.languages.map((lang) => {
                const languageObject = languagesMap.get(lang);
                if (!languageObject) {
                    throw new Error(`Language not found: ${lang}`);
                }
                return {
                    driverId: newDriverId[0]?.id ?? "",
                    languageCode: languageObject.code,
                };
            });

            await db.insert(driverLanguage).values(driverLanguageLinks);
        }
    }
}
