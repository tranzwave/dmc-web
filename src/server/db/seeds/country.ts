import { DB } from "..";
import { country } from "../schema";
import countries from './data/countries.json'
import { Country, State, City }  from 'country-state-city';

export default async function seed(db:DB) {

    await db.insert(country).values(Country.getAllCountries().map(c => {
        return {
            name: c.name,
            code: c.isoCode,
        }
    }));
}