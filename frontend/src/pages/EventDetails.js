import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, createBooking } from "../api";
import SeatGrid from "../components/SeatGrid";

export default function EventDetails() {
  const { id }             = useParams();
  const navigate           = useNavigate();
  const [event,    setEvent]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail,setUserEmail]= useState("");
  const [booking,  setBooking]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetchEventById(id)
      .then(res => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!userName.trim())    { setError("Please enter your name.");  return; }
    if (!userEmail.trim())   { setError("Please enter your email."); return; }
    if (selected.length < 1) { setError("Please select at least 1 seat."); return; }

    setError("");
    setBooking(true);
    try {
      const res = await createBooking({
        eventId:    Number(id),
        userName:   userName.trim(),
        userEmail:  userEmail.trim(),
        seats:      selected.length,
      });
      navigate("/confirmation", {
        state: { booking: res.data, event, seats: selected }
      });
    } catch (e) {
      setError(e?.response?.data || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="flex items-center justify-center min-h-screen bg-dark text-gray-400">
      <p className="text-xl">{error || "Event not found."}</p>
    </div>
  );

  const totalCost = selected.length * event.price;

  return (
    <div className="bg-dark min-h-screen">
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        <img
          src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200"}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold mb-2 inline-block">
            {event.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{event.name}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
            <span>📍 {event.location}</span>
            <span>📅 {event.eventDate}</span>
            <span>💺 {event.availableSeats} seats left</span>
            <span className="text-red-400 font-bold text-base">₹{event.price} / seat</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Left: Seat Selection */}
        <div className="md:col-span-2">
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">About this Event</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-center">🪑 Select Your Seats</h2>
            <SeatGrid
              totalSeats={event.totalSeats}
              bookedSeats={[]}
              onSelectionChange={setSelected}
            />
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Booking Summary</h2>

            {/* User inputs */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Your Full Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Seats selected</span>
                <span className="text-white font-semibold">{selected.length}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Price per seat</span>
                <span className="text-white">₹{event.price}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-red-400 text-lg">₹{totalCost}</span>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

            <button
              onClick={handleBook}
              disabled={booking || event.availableSeats === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {booking ? "Booking..." : event.availableSeats === 0 ? "Sold Out" : `Confirm Booking`}
            </button>

            <p className="text-gray-600 text-xs text-center mt-2">Secure booking · Instant confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
