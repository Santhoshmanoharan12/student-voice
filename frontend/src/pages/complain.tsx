import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ComplainPage() {
  const [category, setCategory] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [concern, setConcern] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("sessionToken")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    setError("");
    setSubmitted(false);

    if (!category || !subject.trim() || !concern.trim()) {
      setError("Please Fill In all Fields.");
      return;
    }

    const token = sessionStorage.getItem("sessionToken");
    if (!token) {
      setError("Your session has expired. Please verify your email again.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/complaints/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Token": token,
        },
        body: JSON.stringify({ subject, concern, category }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("studentEmail");
        setCategory(""); setSubject(""); setConcern("");
      } else {
        setError(data.detail || "Failed to submit concern.");
      }
    } catch (error) {
      console.error("Error submitting concern:", error);
      setError("Unable to connect to the server, Please try again later :(");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-purple-100 to-purple-200 font-sans px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 mt-4 md:mt-8 text-center">Submit Your Concern</h1>
      <p className="text-purple-800 mb-6 md:mb-8 text-center max-w-xl mt-4 md:mt-9">
        Explain your concern clearly. Your message will be sent Directly to the Principal. Please be respectful and concise in your message.
      </p>

      <p className="text-red-600 mb-6 md:mb-8 text-center max-w-xl mt-4 md:mt-1">
        Please Wait For <span className="font-bold">3 - 5</span> Seconds After Submitting
      </p>

      <div className="w-full max-w-xl">
        <label className="block font-medium text-center mb-4">Concern Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-400 rounded-md px-4 py-8 mb-6"
        >
          <option value="">Select a category</option>
          <option value="academic">Academic</option>
          <option value="admission">Admission</option>
          <option value="anonymous">Anonymous / sexual harassment</option>
          <option value="ragging">Ragging</option>
          <option value="cyberbullying">Cyberbullying / Online Harassment</option>
          <option value="placements">Placements / Internships</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="faculty">Faculty / Staff</option>
          <option value="certificate">Certificate / Document issues</option>
          <option value="examination">Examination / Results</option>
          <option value="revaluation">Revaluation</option>
          <option value="discipline">Discipline Committee</option>
          <option value="patent">Patent / Intellectual Property Cell</option>
          <option value="it_support">Wi-Fi / IT Services</option>
          <option value="health">Health / Safety</option>
          <option value="cultural">Cultural / Social</option>
          <option value="administration">Office Administration</option>
          <option value="events">Events / Activities</option>
          <option value="library">Library</option>
          <option value="sports">Sports / Recreation</option>
          <option value="cafeteria">Cafeteria / Food</option>
          <option value="finance">Scholarships / Financial Aid</option>
          <option value="research">Research</option>
          <option value="club">Clubs / Organizations</option>
          <option value="hostel">Hostel</option>
          <option value="transport">Transport</option>
          <option value="parking">Parking / Security</option>
          <option value="fees">Fees</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="w-full max-w-xl text-center">
        <label className="block mb-7 font-medium">Subject</label>
        <input
          type="text"
          placeholder="Enter the subject"
          className="w-full border border-gray-400 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <label className="block mb-6 mt-3 font-medium">Your Concern</label>
        <textarea
          placeholder="Describe your concern..."
          rows={7}
          className="w-full border border-gray-400 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
        />

        {error && <p className="text-red-600 font-medium mb-4 text-center">{error}</p>}
        {submitted && (
          <p className="text-green-600 font-medium mb-4">
            Your concern has been submitted successfully.
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white rounded-md py-2 px-6 hover:bg-purple-600 mb-13 mt-3"
        >
          Submit Concern
        </button>
      </div>
    </div>
  );
}

export default ComplainPage;