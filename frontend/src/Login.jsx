import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    const response = await fetch("http://127.0.0.1:8000/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData.access_token);

    if (response.ok) {
      // Save access token to localStorage
      localStorage.setItem("access_token", responseData.access_token);
      // Redirect to dashboard
      navigate("/dashboard/");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <Link to="/" className="link-btn">
        Don't have an account? Register here.
      </Link>
    </div>
  );
};

export default Login;
