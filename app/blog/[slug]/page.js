// app/blog/[slug]/page.js
import { getPostBySlug, getAllPosts } from "@/app/lib/strapi";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.attributes.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  return {
    title: post.attributes.title,
    description: post.attributes.description,
  };
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to all posts
      </Link>

      {post.attributes.featuredImage?.data && (
        <div className="mb-6">
          <img
            src={`${
              process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
            }${post.attributes.featuredImage.data.attributes.url}`}
            alt={post.attributes.title}
            className="rounded-lg w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{post.attributes.title}</h1>

      <div className="flex items-center text-gray-600 mb-8">
        <span>
          {new Date(post.attributes.publishedAt).toLocaleDateString()}
        </span>
        {post.attributes.author?.data && (
          <>
            <span className="mx-2">•</span>
            <span>By {post.attributes.author.data.attributes.name}</span>
          </>
        )}
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.attributes.content }}
      />
    </article>
  );
}
