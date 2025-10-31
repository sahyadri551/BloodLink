import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Try again.");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
          BloodLink
        </Link>
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <NavLink
                to="/active-requests"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Active Requests
              </NavLink>
              <NavLink
                to="/request-blood"
                className={({ isActive }) =>
                  isActive ? "text-red-600 font-bold" : "text-gray-700 hover:text-red-600 font-medium"
                }
              >
                Request Blood
              </NavLink>
              <NavLink
                to="/my-requests"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                My Requests
              </NavLink>
              <span className="text-gray-700 text-sm">
                Logged in as <strong>{currentUser.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/active-requests"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Active Requests
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                    isActive
                    ? "text-blue-600 font-bold" 
                    : "text-gray-700 hover:text-blue-600 font-medium transition"
                    }
                >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                    isActive
                    ? "bg-blue-800 text-white px-4 py-2 rounded-md transition" // "Highlighted" style
                    : " border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                }
                >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
