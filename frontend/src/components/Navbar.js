import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black">
            <span className="text-white">event</span>
            <span className="text-red-500">ify</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, movies, sports..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
              🔍
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
          <Link to="/admin"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition font-semibold">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
