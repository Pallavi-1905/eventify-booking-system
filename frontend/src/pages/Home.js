import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchEvents, getRecommendations } from "../api";
import EventCard from "../components/EventCard";

const CATEGORIES = ["All", "Movies", "Sports", "Music", "Comedy"];
const LOCATIONS  = ["All", "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Goa"];

export default function Home() {
  const [events,       setEvents]       = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [recommended,  setRecommended]  = useState([]);
  const [category,     setCategory]     = useState("All");
  const [location,     setLocation]     = useState("All");
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const { search: qs } = useLocation();
  const searchQuery = new URLSearchParams(qs).get("search") || "";

  // Fetch all events
  useEffect(() => {
    fetchEvents()
      .then(res => {
        setEvents(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError("Could not connect to backend. Make sure Spring Boot is running on port 8080."))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  useEffect(() => {
    let data = [...events];
    if (category !== "All") data = data.filter(e => e.category === category);
    if (location  !== "All") data = data.filter(e => e.location  === location);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [events, category, location, searchQuery]);

  // AI recommendations when category changes
  useEffect(() => {
    if (category === "All") { setRecommended([]); return; }
    getRecommendations({ category })
      .then(res => setRecommended(res.data.recommendations || []))
      .catch(() => setRecommended([]));
  }, [category]);

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Banner */}
      <div className="hero-gradient py-14 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-3">
          🎟️ <span className="text-white">Discover &</span>{" "}
          <span className="text-red-500">Book Events</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Movies, Concerts, Sports & More — All in One Place
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition
                ${category === c
                  ? "bg-red-600 text-white shadow-lg shadow-red-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Location Filter */}
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {LOCATIONS.map(l => <option key={l} value={l}>{l === "All" ? "📍 All Cities" : `📍 ${l}`}</option>)}
        </select>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-600 text-red-200 p-4 rounded-xl my-6 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* AI Recommendations */}
        {recommended.length > 0 && (
          <div className="my-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🤖 <span className="text-red-400">AI Recommended</span>
              <span className="text-gray-400 font-normal text-sm">for {category}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommended.map((e, i) => (
                <div key={i} className="bg-gray-900 border border-red-900 rounded-xl p-3 text-sm">
                  <p className="font-semibold text-white truncate">{e.name}</p>
                  <p className="text-gray-400 text-xs">{e.location} · ₹{e.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Results for "${searchQuery}"` : category === "All" ? "All Events" : category}
            </h2>
            <span className="text-gray-500 text-sm">{filtered.length} events found</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🎭</p>
              <p className="text-xl">No events found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 fade-in">
              {filtered.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
