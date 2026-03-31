import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from './components/Navbar';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MessagesView from "./pages/MessagesView";

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

/* New Features */
import Planner from "./pages/Planner";
import Suitcase from "./pages/Suitcase";
import Notes from "./pages/Organizer";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/messages" element={<MessagesView />} />

          {/* Protected Routes */}
          <Route path="/wardrobe" element={
            <PrivateRoute>
              <Wardrobe />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/recommendations" element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          } />

          <Route path="/event" element={
            <PrivateRoute>
              <Event />
            </PrivateRoute>
          } />

          <Route path="/planner" element={
            <PrivateRoute>
              <Planner />
            </PrivateRoute>
          } />

          <Route path="/suitcase" element={
            <PrivateRoute>
              <Suitcase />
            </PrivateRoute>
          } />

          <Route path="/notes" element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          } />

          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />

          {/* Fallback - MUST BE LAST */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;