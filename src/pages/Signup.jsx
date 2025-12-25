import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/api";   // 👈 import API

export default function Signup() {
  // 👇 state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👇 WRITE THE FUNCTION HERE (NOT BELOW RETURN)
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await signupUser({ email, password });

    if (res.error) alert(res.error);
    else alert("Signup successful");
  };

  // 👇 JSX STARTS HERE
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightpink">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 transition-transform duration-300 hover:scale-105">

        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Create MyTwit Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}   // 👈 CONNECT HERE
          className="w-full bg-lightpink text-black py-3 rounded-lg font-semibold
                     transition-all duration-300 hover:bg-pink-400 hover:shadow-md"
        >
          Sign Up
        </button>

        <p className="text-center text-black mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
