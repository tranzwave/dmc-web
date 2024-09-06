// db.ts
const isProduction = process.env.NODE_ENV === "production";

console.log(`Current DB Environment: ${process.env.NODE_ENV}`);

export const { db } = isProduction
  ? require("./db.production")
  : require("./db.development");

export type DB = typeof db;
