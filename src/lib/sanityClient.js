import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = "bcij3qe4";
const dataset = "production";

// Create the Sanity client
export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: "2023-08-30",
  token: process.env.SANITY_API_TOKEN, // Store your token securely
  useCdn: false, // Set to `true` for cached data
  withCredentials: true, // Required for CORS
});

// Set up the image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source) {
  return builder.image(source);
}

export const getUrlFromId = (ref) => {
  // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
  // We don't need the first part, unless we're using the same function for files and images
  const [_file, id, extension] = ref.split("-");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
};
