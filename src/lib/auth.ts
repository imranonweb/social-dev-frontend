import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social_dev_db";

const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "temporary-fallback-secret-key-at-least-32-characters-long",
});

