// app/blog/[slug]/page.js
import { getPostBySlug, getAllPosts } from "@/app/lib/strapi";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static paths for all posts
export async function generateStaticParams() {
  console.log("Running generateStaticParams for blog posts");
  const posts = await getAllPosts();
  
  // Safely handle the post structure
  return posts.map((post) => {
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
  }).filter(Boolean); // Remove any null entries
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
  console.log("Post structure:", 
    postData ? 
    `Title: ${postData.title}, Has content: ${Boolean(postData.content)}` : 
    "Invalid post data"
  );
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to all posts
      </Link>
      
      {/* Support featured image in both data structures */}
      {(postData.featuredImage?.data || postData.featuredImage) && (
        <div className="mb-6">
          <img
            src={`${
              process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
            }${
              postData.featuredImage.data 
                ? postData.featuredImage.data.attributes.url 
                : postData.featuredImage.url
            }`}
            alt={postData.title}
            className="rounded-lg w-full h-auto object-cover max-h-96"
          />
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        {postData.publishedAt && (
          <span>
            {new Date(postData.publishedAt).toLocaleDateString()}
          </span>
        )}
        
        {/* Support author in both data structures */}
        {(postData.author?.data || postData.author) && (
          <>
            <span className="mx-2">•</span>
            <span>By {
              postData.author.data 
                ? postData.author.data.attributes.name 
                : postData.author.name
            }</span>
          </>
        )}
      </div>
      
      {/* Handle different content formats */}
      {typeof postData.content === 'string' ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />
      ) : Array.isArray(postData.content) ? (
        <div className="prose max-w-none">
          {postData.content.map((block, blockIndex) => {
            if (block.type === 'paragraph') {
              return (
                <p key={blockIndex}>
                  {block.children.map((child, childIndex) => {
                    if (child.type === 'text') {
                      return <span key={childIndex}>{child.text}</span>;
                    }
                    return null;
                  })}
                </p>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="prose max-w-none">
          <p>Content format not supported.</p>
        </div>
      )}
    </article>
  );
}