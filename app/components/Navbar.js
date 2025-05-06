"use client"; // app/components/Navbar.js
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  // Add padding to body to prevent content from hiding behind the sticky navbar
  useEffect(() => {
    // Get navbar height and add padding to body
    const navbar = document.querySelector("nav");
    if (navbar) {
      const navbarHeight = navbar.offsetHeight;
      document.body.style.paddingTop = `${navbarHeight}px`;
    }

    // Clean up function
    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, []);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the link is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Check if screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "#", label: "Twitter" },
    { href: "#", label: "GitHub" },
    { href: "#", label: "LinkedIn" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between px-4 md:px-0">
          {/* Strapi Blog title */}
          <div className="md:flex-1">
            <Link
              href="/"
              className="text-2xl font-mono font-bold text-gray-800 dark:text-white px-4"
            >
              Strapi Blog
            </Link>
          </div>

          {/* Hamburger menu button - shown only on mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  // X icon when menu is open
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Hamburger icon when menu is closed
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex md:flex-2 md:flex-grow-[2] px-6 py-2">
            <div className="flex justify-around w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 rounded-md ${
                    isActive(link.href)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-50 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - shown only when menu is open */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden fixed z-40 left-0 right-0 top-auto bg-white dark:bg-gray-800 shadow-lg`}
        >
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-2 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-2 rounded-md ${
                  isActive(link.href)
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-50 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
