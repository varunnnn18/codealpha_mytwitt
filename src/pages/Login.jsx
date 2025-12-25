import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await loginUser({ email, password });

    if (res.error) {
      alert(res.error);
    } else {
      // JWT token is already saved in localStorage in api.js
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightpink">
      <div
        className="bg-white p-8 rounded-2xl shadow-lg w-96
                   transition-transform duration-300 hover:scale-105"
      >
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          MyTwit Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-lightpink text-black py-3 rounded-lg font-semibold
                     transition-all duration-300 hover:bg-pink-400 hover:shadow-md"
        >
          Login
        </button>

        <p className="text-center text-black mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
