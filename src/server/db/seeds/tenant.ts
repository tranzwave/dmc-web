import { and, eq } from "drizzle-orm";
import { DB } from "..";
import tenants from './data/tenants.json';
import { country,tenant } from "../schema";

export default async function seed(db:DB) {
    // Fetch or create countries
    const countries = await Promise.all(
      tenants.map(async (tenant) => {
        const foundCountry = await db.query.country.findFirst({
          where: eq(country.code, tenant.country),
        });
  
        if (!foundCountry) {
          // Create a new country if it does not exist
          const newCountryCode = await db.insert(country).values(
            {
                "name": "Sri Lanka",
                "code": tenant.country
            },
          ).returning({
            code: country.code
          });
  
          return newCountryCode;
        }
  
        return foundCountry.code;
      })
    );
  
    // Flatten country IDs array
    const countryCodes = [...new Set(countries)]; // Remove duplicates
  
    // Fetch or create tenants
    await Promise.all(
      tenants.map(async (currentTenant) => {
        const countryCode = countryCodes.find(code => code === currentTenant.country);
  
        if (!countryCode) {
          throw new Error("Country not found for tenant: " + currentTenant.country);
        }
  
        // Check if tenant already exists
        const foundTenant = await db.query.tenant.findFirst({
          where: and(
            eq(tenant.country, currentTenant.country),
            eq(tenant.domain, currentTenant.domain) // Assuming name is unique for tenants
          ),
        });
  
        if (!foundTenant) {
          // Create a new tenant if it does not exist
          await db.insert(tenant).values(currentTenant);
        }
      })
    );
  }
  