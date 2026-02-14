import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

/* Public Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import Inspiration from "./pages/Inspiration";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* Protected Pages */
import Wardrobe from "./pages/Wardrobe";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import Event from "./pages/Event";

function App() {
  return (
    <Router>
      <Routes>

        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/wardrobe"
          element={
            <PrivateRoute>
              <Wardrobe />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          }
        />

        <Route
          path="/event"
          element={
            <PrivateRoute>
              <Event />
            </PrivateRoute>
          }
        />

        {/* ========== FALLBACK ROUTE ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
