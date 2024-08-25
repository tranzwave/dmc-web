import { DB } from "..";
import { country } from "../schema";
import countries from './data/countries.json'

export default async function seed(db:DB) {
    await db.insert(country).values(countries);
}