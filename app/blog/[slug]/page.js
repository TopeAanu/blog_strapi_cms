// app/blog/[slug]/page.js
import { getPostBySlug, getAllPosts } from "@/app/lib/strapi";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon } from "lucide-react"; // Import the clock icon

// Generate static paths for all posts
export async function generateStaticParams() {
  console.log("Running generateStaticParams for blog posts");
  const posts = await getAllPosts();

  // Safely handle the post structure
  return posts
    .map((post) => {
      // Handle both direct properties and attributes structure
      const postData = post.attributes || post;

      // If we can't find the slug, log it and skip this post
      if (!postData || !postData.slug) {
        console.error("Missing slug in post data:", post);
        return null;
      }

      return {
        slug: postData.slug,
      };
    })
    .filter(Boolean); // Remove any null entries
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  // Handle both direct properties and attributes structure
  const postData = post.attributes || post;

  return {
    title: postData.title,
    description: postData.description,
  };
}

// Function to convert markdown-like syntax to HTML
function formatText(text) {
  if (!text) return "";

  // Remove "Drag" text that appears to be CMS artifacts
  let formattedText = text.replace(/Drag\s*$/g, "").trim();

  // Convert markdown bold (**text**) to HTML <strong> tags
  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Convert markdown italic (*text*) to HTML <em> tags
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert markdown links [text](url) to HTML <a> tags
  formattedText = formattedText.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
  );

  return formattedText;
}

// Function to calculate read time based on content
function calculateReadTime(content) {
  // Return 1 minute for empty content
  if (!content) return 1;

  let text = "";

  // Handle string content
  if (typeof content === "string") {
    text = content;
  }
  // Handle array of blocks content (Strapi's structured format)
  else if (Array.isArray(content)) {
    content.forEach((block) => {
      if (block.type === "paragraph" && Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.type === "text" && child.text) {
            text += " " + child.text;
          }
        });
      }
    });
  }

  // Calculate reading time based on average reading speed (200 words per minute)
  const wordCount = text.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return readTimeMinutes;
}

export default async function BlogPost({ params }) {
  console.log("Rendering blog post for slug:", params.slug);
  const post = await getPostBySlug(params.slug);

  if (!post) {
    console.log("Post not found, returning 404");
    notFound();
  }

  // Handle both direct properties and attributes structure
  const postData = post.attributes || post;

  // Add debugging for the post structure
  console.log(
    "Post structure:",
    postData
      ? `Title: ${postData.title}, Has content: ${Boolean(postData.content)}`
      : "Invalid post data"
  );

  // Extract author information with improved handling
  let authorName = null;
  let authorEmail = null;

  if (postData.author) {
    if (postData.author.data && postData.author.data.attributes) {
      // Strapi v4 structure
      authorName = postData.author.data.attributes.name;
      authorEmail = postData.author.data.attributes.email;
    } else if (postData.author.name) {
      // Direct property structure
      authorName = postData.author.name;
      authorEmail = postData.author.email;
    }
  }

  // Get featured image URL
  let featuredImageUrl = null;
  if (postData.featuredImage) {
    if (postData.featuredImage.data && postData.featuredImage.data.attributes) {
      // Strapi v4 structure
      featuredImageUrl = postData.featuredImage.data.attributes.url;
    } else if (postData.featuredImage.url) {
      // Direct property structure
      featuredImageUrl = postData.featuredImage.url;
    }

    // Add domain if it's a relative URL
    if (featuredImageUrl && !featuredImageUrl.startsWith("http")) {
      featuredImageUrl = `${
        process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
      }${featuredImageUrl}`;
    }
  }

  // Calculate reading time
  const readTimeMinutes = calculateReadTime(postData.content);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="text-purple-600 hover:text-purple-800 mb-6 inline-block"
      >
        ← Back to all posts
      </Link>

      {/* Featured image handling */}
      {featuredImageUrl && (
        <div className="mb-6 relative h-80 w-full">
          <Image
            src={featuredImageUrl}
            alt={postData.title}
            fill
            className="rounded-lg object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>

      {/* Author, publish date, and read time information */}
      <div className="flex flex-wrap items-center mb-8">
        {/* Author information with improved styling */}
        {authorName && (
          <div className="flex items-center mr-4 mb-2 sm:mb-0">
            <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2">
              <p className="font-semibold">{authorName}</p>
              {authorEmail && (
                <p className="text-sm text-gray-600">{authorEmail}</p>
              )}
            </div>
          </div>
        )}

        {/* Publication date */}
        {postData.publishedAt && (
          <div className="text-gray-600">
            <span className="inline-block border-l pl-4 ml-4 border-gray-300">
              Published on{" "}
              {new Date(postData.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Read time indicator */}
        <div className="flex items-center text-gray-600 ml-auto">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{readTimeMinutes} min read</span>
        </div>
      </div>

      {/* Improved content rendering with markdown support */}
      <div className="prose max-w-none">
        {/* Handle string content */}
        {typeof postData.content === "string" && (
          <div
            dangerouslySetInnerHTML={{ __html: formatText(postData.content) }}
          />
        )}

        {/* Handle array of blocks content (Strapi's structured format) */}
        {Array.isArray(postData.content) &&
          postData.content.map((block, blockIndex) => {
            if (block.type === "paragraph") {
              // Join all text from children and convert markdown
              const paragraphText = block.children
                .filter((child) => child.type === "text")
                .map((child) => child.text)
                .join("");

              // Format the text and render the paragraph
              return (
                <div
                  key={blockIndex}
                  className="mb-4"
                  dangerouslySetInnerHTML={{
                    __html: formatText(paragraphText),
                  }}
                />
              );
            }
            return null;
          })}

        {/* Fallback for unsupported content format */}
        {!Array.isArray(postData.content) &&
          typeof postData.content !== "string" && (
            <p>Content format not supported.</p>
          )}
      </div>
    </article>
  );
}
