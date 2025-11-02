import React, { Fragment } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";

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
      <div className="max-w-full mx-2 px-1 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
          BloodLink
        </Link>
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/find-donation"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Find Donation
              </NavLink>
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
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        Logged in as<br/>
                        <strong className="text-gray-700">{currentUser.email}</strong>
                      </div>
                      {(currentUser.role === 'admin' || (currentUser.role === 'hospital' && currentUser.isVerified)) && (
                        <MenuItem>
                          {({ active }) => (
                            <NavLink
                              to="/confirm-donation"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm font-semibold text-green-600`} // Styled to stand out
                            >
                              Confirm Donation
                            </NavLink>
                          )}
                        </MenuItem>
                      )}
                      {currentUser.role === 'admin' && (
                        <>
                          <MenuItem>
                            {({ active }) => (
                              <NavLink
                                to="/admin-dashboard"
                                className={`${
                                  active ? 'bg-gray-100' : 'text-gray-700'
                                } block px-4 py-2 text-sm font-bold text-red-600`}
                              >
                                Admin Dashboard
                              </NavLink>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <NavLink
                                to="/write-post"
                                className={`${
                                  active ? 'bg-gray-100' : 'text-gray-700'
                                } block px-4 py-2 text-sm font-bold text-red-600`}
                              >
                                Write New Post
                              </NavLink>
                            )}
                          </MenuItem>
                        </>
                      )}
                      {currentUser.role === 'hospital' && currentUser.isVerified === true && (
                        <>
                        <MenuItem>
                          {({ active }) => (
                            <NavLink
                              to="/create-camp"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm font-semibold text-blue-600`} // Styled to stand out
                            >
                              Create Blood Camp
                            </NavLink>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <NavLink
                              to="/hospital-bookings"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            >
                              Manage Bookings
                            </NavLink>
                          )}
                        </MenuItem>
                        </>
                      )}
                      <MenuItem>
                        {({ active }) => (
                          <NavLink
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          >
                            My Profile
                          </NavLink>
                        )}
                      </MenuItem>
                      
                      <MenuItem>
                        {({ active }) => (
                          <NavLink
                            to="/my-requests"
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          >
                            My Requests
                          </NavLink>
                        )}
                      </MenuItem>
                      <MenuItem>
                          {({ active }) => (
                            <NavLink
                              to="/my-account"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm border-t border-gray-100`}
                            >
                              My Account
                            </NavLink>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <NavLink
                              to="/my-bookings"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            >
                              My Appointments
                            </NavLink>
                          )}
                        </MenuItem>
                        <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            Logout
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
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
                to="/find-donation"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Find Donation
              </NavLink>
              <NavLink
                to="/eligibility-check"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Check Eligibility
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 font-medium"
                }
              >
                Blog
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
                    ? "bg-blue-800 text-white px-4 py-2 rounded-md transition"
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