import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, LogOut, Menu, X } from "lucide-react";

function Navbar({ logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="text-blue-600">Meme</span>
              <span className="text-gray-800">Text</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <Home className="mr-2" size={22} />
              Home
            </Link>
            <Link
              to="/profile"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <User className="mr-2" size={22} />
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              <LogOut className="mr-2" size={22} />
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md rounded-b-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <Link
          to="/home"
          onClick={() => setIsOpen(false)}
          className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
        >
          <Home className="mr-3" size={20} />
          Home
        </Link>
        <Link
          to="/profile"
          onClick={() => setIsOpen(false)}
          className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
        >
          <User className="mr-3" size={20} />
          Profile
        </Link>
        <button
          onClick={() => {
            logout();
            navigate("/login");
            setIsOpen(false);
          }}
          className="flex items-center w-full px-5 py-3 text-red-500 hover:bg-gray-100 transition"
        >
          <LogOut className="mr-3" size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
