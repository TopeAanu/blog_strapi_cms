// app/page.js
import Link from "next/link";
import Image from "next/image"; // Add this import
import { getAllPosts } from "./lib/strapi";

export default async function Home() {
  console.log("Server", "About to fetch posts");
  const posts = await getAllPosts();

  // Check what we received
  console.log(
    "Server",
    "Received posts:",
    posts ? `${posts.length} posts` : "no posts"
  );
  if (posts && posts.length > 0) {
    console.log(
      "Server",
      "First post sample:",
      JSON.stringify(posts[0]).slice(0, 300) + "..."
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-8">Strapi's Headless CMS</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => {
            // First, check if we have direct properties OR attributes structure
            const postData = post.attributes || post;

            if (!postData || (!postData.title && !postData.slug)) {
              console.log("Server", "Invalid post structure detected:", post);
              return (
                <div
                  key={Math.random()}
                  className="border border-red-300 p-4 rounded"
                >
                  <p>Invalid post structure</p>
                  <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(post, null, 2)}
                  </pre>
                </div>
              );
            }

            // Get featured image URL using same logic as your blog/[slug]/page.js
            let imageUrl = null;
            if (postData.featuredImage) {
              if (postData.featuredImage.data) {
                // Strapi v4 structure
                imageUrl = postData.featuredImage.data.attributes.url;
              } else if (postData.featuredImage.url) {
                // Direct URL property
                imageUrl = postData.featuredImage.url;
              }

              // Add domain if it's a relative URL
              if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `${
                  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
                }${imageUrl}`;
              }
            }

            return (
              <div
                key={post.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Add image section before the text content */}
                {imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={imageUrl}
                      alt={postData.title || "Blog post image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {postData.title || "Untitled"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {postData.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {postData.publishedAt
                        ? new Date(postData.publishedAt).toLocaleDateString()
                        : "No date"}
                    </span>
                    {postData.slug && (
                      <Link
                        href={`/blog/${postData.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read more →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center">
            <p className="text-red-500 font-bold">No posts found.</p>
            <p className="text-gray-500 mt-2">
              Make sure your Strapi server is running at:{" "}
              {process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
