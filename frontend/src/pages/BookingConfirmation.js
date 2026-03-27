import { useLocation, useNavigate, Link } from "react-router-dom";

export default function BookingConfirmation() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  if (!state?.booking) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-4">No booking info found.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const { booking, event, seats } = state;

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-3xl p-8 text-center fade-in">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-6">Your tickets are booked. Enjoy the event! 🎉</p>

        {/* Ticket */}
        <div className="bg-gray-900 rounded-2xl p-5 text-left space-y-3 border border-gray-700 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Booking ID</span>
            <span className="text-white font-bold">#{booking.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Event</span>
            <span className="text-white font-semibold text-right max-w-[60%]">{event?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{booking.userName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email</span>
            <span className="text-white text-xs">{booking.userEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Seats</span>
            <span className="text-white">{booking.seats} seat(s)</span>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between font-bold">
            <span className="text-gray-400">Total Paid</span>
            <span className="text-green-400 text-lg">₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400 font-bold">{booking.status}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate("/")} className="flex-1 btn-primary">
            Browse More
          </button>
          <button onClick={() => window.print()} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl font-semibold transition">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}
