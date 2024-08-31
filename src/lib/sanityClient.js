import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "bcij3qe4",
  dataset: "production",
  apiVersion: "2023-08-30",
  token: process.env.SANITY_API_TOKEN, // Store your token securely in environment variables
  useCdn: false, // `false` if you want to ensure fresh data, `true` for faster responses using cached data
});
