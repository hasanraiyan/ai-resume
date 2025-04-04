// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteHeader } from "./components/custom/SiteHeader"; // Adjusted import path if needed
import { Footer } from "./components/custom/Footer";       // Adjusted import path if needed
import { HomePage } from "./pages/HomePage";
import { ResultPage } from "./pages/ResultPage";
import { DeveloperPage } from './pages/DeveloperPage';
import { NotFoundPage } from "./pages/NotFoundPage";
// Import other pages like LoginPage if you create them

fetch('https://ai-resume-70ka.onrender.com/server-alive')
  .then(data => console.log(data))
  .catch(err => console.error(err));

export default function App() {
  return (
    <Router>
      {/* Header and Footer outside Routes will appear on all pages */}
      <SiteHeader />
      <main className="flex-grow"> {/* Add flex-grow if using flex layout for sticky footer */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}