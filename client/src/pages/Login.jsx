import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEffect(() => {
  if (currentUser) {
    console.log("User already logged in, redirecting to home...");
    navigate('/');
  }
}, [currentUser, navigate]);

  const validate = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required.';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      console.warn("Validation failed:", errors);
      alert("Please fill in all required fields.");
      return; 
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      if (user.emailVerified) {
        console.log("User signed in and verified:", user);
        setFormData({ email: '', password: '' });
        navigate('/');
      } else {
        console.warn("User signed in but email is NOT verified.");
        alert("Your email is not verified. Please check your inbox for the verification link.");
        await signOut(auth);
        navigate('/login');
      }

    } catch (error) {
      console.error("Firebase login error:", error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("Invalid email or password. Please try again.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md transition duration-200 hover:bg-blue-900"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
