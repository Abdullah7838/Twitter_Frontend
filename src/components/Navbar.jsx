import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, LogOut, Menu, X } from "lucide-react";

function Navbar({ logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">Meme Text</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/home" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center space-x-2 text-red-500 hover:text-red-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            to="/home"
            className="block py-3 px-4 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/profile"
            className="block py-3 px-4 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/login");
              setIsOpen(false);
            }}
            className="block py-3 px-4 text-red-500 hover:bg-gray-100 flex items-center space-x-2 w-full text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
