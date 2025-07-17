import { eq } from "drizzle-orm";
import { DB } from "..";
import agents from './data/agents.json'
import { country,agent } from "../schema";

export default async function seed(db:DB) {
    
    // Fetch or create countries
    const countries = await Promise.all(
      agents.map(async (currentAgent) => {
        const foundCountry = await db.query.country.findFirst({
          where: eq(country.code, currentAgent.country),
        });
  
        if (!foundCountry) {
          // Create a new country if it does not exist
          const newCountryCode = await db.insert(country).values(
            {
                "name": `${currentAgent.country}-C`,
                "code": currentAgent.country
            },
          ).returning({
            code: country.code
          });
  
          return newCountryCode[0]?.code;
        }
  
        return foundCountry.code;
      })
    );
  
    // Flatten country IDs array
    const countryCodes = [...new Set(countries)]; // Remove duplicates

    //Fetch a tenant
    const tenant = await db.query.tenant.findFirst();

    if(!tenant){
        throw new Error("Tenant not found");
    }

    console.log(countryCodes)
    // Fetch or create tenants
    await Promise.all(
      agents.map(async (currentAgent) => {
        const countryCode = countryCodes.find(code => code === currentAgent.country);
  
        if (!countryCode) {
          throw new Error("Country not found for agent: " + currentAgent.country);
        }
  
        // Check if tenant already exists
        const foundAgent = await db.query.agent.findFirst({
          where: eq(agent.email, currentAgent.email),
        });
  
        if (!foundAgent) {
          await db.insert(agent).values({
            "tenantId": tenant.id,
            "countryCode" : currentAgent.country,
            "name" : currentAgent.name,
            "email" :currentAgent.email,
            "agency": currentAgent.agency,
            "primaryContactNumber":currentAgent.primaryContactNumber,
            "address": "currentAgent.address",
            "marketingTeamId": "currentAgent.marketingTeamId",

          });
        }
      })
    );
  }
  