// app/about/page.js
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Strapi</h1>
      <p className="mb-4">
        Strapi is an open-source headless CMS designed to make content
        management simple, flexible, and developer-friendly. Built with Node.js,
        it allows developers to create customizable APIs quickly using a modern
        admin panel and intuitive content structure.
      </p>
      <p className="mb-4">
        Strapi supports both REST and GraphQL, making it easy to integrate with
        frontend frameworks like React, Vue, or Next.js. One of its key
        strengths is extensibility—you can define custom content types, roles,
        and permissions.
      </p>
      <p>
        It also stores data in popular databases like MongoDB, PostgreSQL, or
        MySQL. Whether you're building a blog, e-commerce platform, or corporate
        site, Strapi empowers developers to manage content with full control.
      </p>
    </div>
  );
}
