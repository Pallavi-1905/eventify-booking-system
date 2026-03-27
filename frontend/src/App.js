import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/event/:id"   element={<EventDetails />} />
        <Route path="/admin"       element={<AdminDashboard />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}
