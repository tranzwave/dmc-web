import { DB } from "..";
import { language } from "../schema";
import languages from "./data/languages.json"

export default async function seed(db:DB) {
    await db.insert(language).values(languages);
}