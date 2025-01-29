import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col  items-center">
      {/* Header */}
      <header className="w-full py-4 bg-blue-500 text-white text-center text-xl font-bold shadow-md">
        Welcome to Mini-Twitter
      </header>

      {/* Hero Section */}
      <div className="max-w-2xl text-center mt-10">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Connect with friends & share your thoughts
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Join Mini-Twitter today and be part of a fast-growing community.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex space-x-4">
        <Link
          to="/signup"
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="border border-blue-500 text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition"
        >
          Log In
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-500 text-sm">
        © {new Date().getFullYear()} Mini-Twitter | Built with ❤️ by Abdullah
      </footer>
    </div>
  );
}

export default Home;
