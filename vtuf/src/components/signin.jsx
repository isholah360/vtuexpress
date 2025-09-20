// src/components/Signin.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://vtuexpress.onrender.com/api/auth/login", {
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
     console.log(data.token)
      // Destructure user from response
      const { user } = data;

      // Save only user (not token) in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("jwt", data.token);
      // Update Redux state
      dispatch(loginSuccess({ token: data.token, user }));

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-sm text-center" >
          Don&apos;t have an account? <a className="text-blue-600" onClick={() => navigate('/register')}>Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Signin;
