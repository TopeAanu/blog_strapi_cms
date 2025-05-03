// app/lib/strapi.js - Fixed Version
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetch all posts from Strapi API
 */
export async function getAllPosts() {
  try {
    console.log("Server", "About to fetch posts from Strapi");

    console.log(
      "Server",
      "Attempting to fetch from:",
      `${STRAPI_URL}/api/posts?populate=*`
    );

    const response = await fetch(`${STRAPI_URL}/api/posts?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching for debugging
    });

    console.log("Server", "Response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Strapi: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      "Server",
      "API Response data:",
      JSON.stringify(data).slice(0, 300) + "..."
    );

    // Return the data array directly, or an empty array if it doesn't exist
    return data.data || [];
  } catch (error) {
    console.error("Server", "Error fetching posts:", error.message);
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug) {
  try {
    console.log("Server", "Fetching post with slug:", slug);

    // Updated this endpoint to use "posts" instead of "blogs" for consistency
    const response = await fetch(
      `${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    console.log("Server", "Single post response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch post: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      "Server",
      "Single post API response:",
      JSON.stringify(data).slice(0, 200) + "..."
    );

    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error(
      `Server", "Error fetching post with slug ${slug}:`,
      error.message
    );
    return null;
  }
}
