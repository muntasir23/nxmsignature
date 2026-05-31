import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handlesubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Failed to login!");
    }
  }

  return (
    <div className="w-full grid place-items-center">
      <div className="md:w-1/2 border m-8 rounded grid place-items-center shadow-md ">
        <div>
          <h2 className="text-center font-bold text-[25px] text-[#613635]">Login - NEXMODE</h2>

          <div className="mt-5">
            <div>
              <input
                type="text"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-black outline-none border rounded-t-md"
              />
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-black outline-none border rounded-b-md shadow"
              />
            </div>
            <div className="mt-5">
              <button disabled={loading} onClick={handlesubmit} className="bg-[#613635] text-white font-bold w-full p-2 rounded-md">
                {loading && <h1>Loading..</h1>}
                {!loading && "Login"}
              </button>
            </div>
            <h1 className="text-center mt-5">
              {error && (
                <input type="text" value={error} className="text-red-600" />
              )}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
