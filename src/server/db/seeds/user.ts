import { eq } from "drizzle-orm";
import { DB } from "..";
import users from './data/users.json'
import { agent, user } from "../schema";

export default async function seed(db:DB) {

    //Fetch a tenant
    const tenant = await db.query.tenant.findFirst();

    if(!tenant){
        throw new Error("Tenant not found");
    }
    // Fetch or create tenants
    await Promise.all(
      users.map(async (currentUser) => {
  
        // Check if tenant already exists
        const foundUser = await db.query.user.findFirst({
          where: eq(user.email, currentUser.email),
        });
  
        if (!foundUser) {
          // Create a new tenant if it does not exist
          await db.insert(user).values({
            "tenantId": tenant.id,
            "name" : currentUser.name,
            "email" :currentUser.email,
            "role": currentUser.role,
            "image": currentUser.image
          });
        }
      })
    );
  }
  