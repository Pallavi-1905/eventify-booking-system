import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  Sports: "bg-blue-600",
  Music:  "bg-purple-600",
  Movies: "bg-yellow-600",
  Comedy: "bg-green-600",
};

export default function EventCard({ event }) {
  const badgeColor = CATEGORY_COLORS[event.category] || "bg-gray-600";
  const pct = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-gray-900 rounded-xl overflow-hidden card-hover border border-gray-800 h-full">
        {/* Image */}
        <div className="relative">
          <img
            src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"}
            alt={event.name}
            className="w-full h-44 object-cover"
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"; }}
          />
          <span className={`absolute top-2 left-2 text-xs font-bold text-white px-2 py-1 rounded-full ${badgeColor}`}>
            {event.category}
          </span>
          {event.availableSeats === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-red-400 font-bold text-lg">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-base leading-tight mb-1 line-clamp-2">{event.name}</h3>
          <p className="text-gray-400 text-xs mb-1">📍 {event.location}</p>
          <p className="text-gray-400 text-xs mb-3">📅 {event.eventDate}</p>

          {/* Seat bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{event.availableSeats} seats left</span>
              <span>{pct}% filled</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${pct > 80 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-red-400 font-bold text-lg">₹{event.price}</span>
            <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">Book Now →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
