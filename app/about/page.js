// app/about/page.js
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About My Blog</h1>
      <p className="mb-4">
        Welcome to my blog! This site was built using Next.js App Router and
        Strapi CMS.
      </p>
      <p className="mb-4">
        I write about technology, web development, and other interesting topics.
        Feel free to explore the articles and let me know what you think!
      </p>
      <p>
        This blog is just a demonstration of how to integrate Next.js with
        Strapi to create a simple but powerful content-driven website.
      </p>
    </div>
  );
}
