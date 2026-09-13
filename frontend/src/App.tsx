import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Verify from "./pages/Verify";  
import ComplainPage from "./pages/complain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/complain" element={<ComplainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;