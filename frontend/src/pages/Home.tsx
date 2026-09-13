import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBtnClick = async () => {
    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@krce.ac.in")) {
      setError("Please enter a valid KRCE domain email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("studentEmail", normalizedEmail);
        navigate("/verify");
      } else {
        setError(data.detail || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-linear-to-b from-purple-100 to-purple-200 w-full px-4">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 md:mb-14 text-purple-600 text-center">Student Voice</h1>
      <p className="text-base md:text-lg max-w-xl text-center mt-4 mb-8 md:mb-12 text-purple-800">
        A Direct Line of Communication Between Students and the College Principal of KRCE
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Your KRCE Domain Email"
        className="border border-gray-400 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md mb-6"
      />
      {error && <p className="text-red-600 font-medium mb-6 text-center">{error}</p>}
      <button
        onClick={handleBtnClick}
        disabled={loading}
        className="bg-green-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-purple-600 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Continue"}
      </button>

    </div>
  );
}

export default Home;