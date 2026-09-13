import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Verify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email] = useState<string>(() => sessionStorage.getItem("studentEmail") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("studentEmail");
    if (!storedEmail) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    setError("");
    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: Number(otp) }),
      });
      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("sessionToken", data.token);
        navigate("/complain");
      } else {
        setError(data.detail || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-purple-100 to-purple-200 font-sans px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6 md:mb-8 text-center">Verify Your Email</h1>
      <p className="text-purple-800 text-center max-w-md mb-6 md:mb-8">
        We have sent a verification code to <strong>{email}</strong>.
      </p>
      <div className="w-full max-w-md">
        <label className="block mb-2 font-medium">Enter OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full border border-gray-400 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-600 font-medium mb-4 text-center">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-green-500 text-white rounded-md py-2 px-6 hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default Verify;