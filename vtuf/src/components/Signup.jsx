// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { username, email, phone, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
         const res = await fetch("http://localhost:5000/api/auth/register", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           credentials: "include", // ✅ Ensure cookie is sent/received
           body: JSON.stringify(formData),
         });
   
         const data = await res.json();
         console.log("Login response:", data);
   
         if (!res.ok || !data.success) {
           throw new Error(data.message || "Login failed");
         }
   
         // Destructure user from response
         const { user } = data;
   
         // Save only user (not token) in localStorage
         localStorage.setItem("user", JSON.stringify(user));
   
         // Update Redux state
         dispatch(loginSuccess({ token: "cookie-based", user }));
   
         // Navigate after successful login
         navigate("/dashboard");
       } catch (err) {
         console.error("Login error:", err);
         setError(err.message || "Invalid email or password");
       } finally {
         setLoading(false);
       }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone (e.g. 08012345678)"
          value={phone}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition`}
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <a href="/signin" className="text-blue-600 hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default Signup;
