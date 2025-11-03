import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', 
  });

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-z0-9]+$/; // only lowercase letters and numbers

  const validate = () => {
    let valid = true;
    let newErrors = { username: '', email: '', password: '', confirmPassword: '', role: '' };

    if (!formData.username) {
      newErrors.username = 'Username is required.';
      valid = false;
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username can only contain lowercase letters and numbers.';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    } 
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role.';
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
      console.warn(" Validation failed:", errors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      console.log("✅ User created in Auth:", user.uid);
      const userDocRef = doc(db, "users", user.uid);
      
      const userData = {
        uid: user.uid,
        username: formData.username.toLowerCase(),
        email: formData.email.toLowerCase(),
        role: formData.role,
        isVerified: formData.role === 'donor', 
        createdAt: serverTimestamp(),
      };

      await setDoc(userDocRef, userData);
      console.log("User profile created in Firestore");

      await sendEmailVerification(user);
      console.log("Verification email sent.");

      alert("Registration successful! Please check your email inbox to verify your account.");
      
      navigate('/login');
      
    } catch (error) {
      console.error("Firebase registration error:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        alert("This email address is already registered. Please try to log in instead.");
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
          Create Your Account
        </h1>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g., johnstark (no spaces)"
            className={`w-full px-3 py-2 border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

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
            required
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
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
            Register as a...
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            required
          >
            <option value="">Select your role</option>
            <option value="donor">Donor / Recipient</option>
            <option value="hospital">Hospital / Blood Bank</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-800 underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;