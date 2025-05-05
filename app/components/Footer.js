// app/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p>&copy; {new Date().getFullYear()} Strapi Blog</p>
        </div>
      </div>
    </footer>
  );
}
