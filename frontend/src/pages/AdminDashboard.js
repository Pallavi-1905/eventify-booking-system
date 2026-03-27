import { useEffect, useState } from "react";
import {
  fetchEvents, createEvent, updateEvent, deleteEvent, fetchBookings
} from "../api";

const EMPTY_FORM = {
  name: "", category: "Movies", location: "", eventDate: "",
  price: "", totalSeats: "", availableSeats: "", image: "", description: ""
};

export default function AdminDashboard() {
  const [tab,      setTab]      = useState("events");
  const [events,   setEvents]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [editing,  setEditing]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState("");

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const load = () => {
    setLoading(true);
    Promise.all([fetchEvents(), fetchBookings()])
      .then(([ev, bk]) => { setEvents(ev.data); setBookings(bk.data); })
      .catch(() => notify("⚠️ Failed to connect to backend."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        totalSeats: parseInt(form.totalSeats),
        availableSeats: parseInt(form.availableSeats || form.totalSeats),
      };
      if (editing) {
        await updateEvent(editing, payload);
        notify("✅ Event updated!");
      } else {
        await createEvent(payload);
        notify("✅ Event created!");
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      load();
    } catch { notify("❌ Failed to save event."); }
  };

  const handleEdit = (ev) => {
    setForm({ ...ev, price: String(ev.price), totalSeats: String(ev.totalSeats), availableSeats: String(ev.availableSeats) });
    setEditing(ev.id);
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try { await deleteEvent(id); notify("🗑️ Event deleted."); load(); }
    catch { notify("❌ Delete failed."); }
  };

  // Analytics
  const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const byCategory   = events.reduce((acc, e) => { acc[e.category] = (acc[e.category]||0)+1; return acc; }, {});

  return (
    <div className="bg-dark min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-black">⚙️ Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage events, bookings & analytics</p>
      </div>

      {msg && (
        <div className="fixed top-20 right-4 bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl shadow-xl z-50 fade-in">
          {msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Events",   value: events.length,   icon: "🎭", color: "text-blue-400" },
            { label: "Total Bookings", value: bookings.length, icon: "🎟️", color: "text-green-400" },
            { label: "Revenue",        value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "text-yellow-400" },
            { label: "Seats Available",value: events.reduce((s,e) => s+e.availableSeats, 0), icon: "💺", color: "text-red-400" },
          ].map(card => (
            <div key={card.label} className="glass rounded-xl p-4">
              <p className="text-2xl mb-1">{card.icon}</p>
              <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-gray-400 text-xs">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="glass rounded-xl p-4 mb-6">
          <h3 className="font-bold mb-3 text-sm text-gray-300">Events by Category</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div key={cat} className="bg-gray-800 rounded-full px-4 py-1 text-sm">
                <span className="text-white font-semibold">{cat}</span>
                <span className="text-gray-400 ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["events","add","bookings"].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t!=="add") { setEditing(null); setForm(EMPTY_FORM); } }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition
                ${tab===t ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {t==="events" ? "📋 All Events" : t==="add" ? (editing ? "✏️ Edit Event" : "➕ Add Event") : "🎟️ Bookings"}
            </button>
          ))}
        </div>

        {/* Events List */}
        {tab === "events" && (
          loading ? <p className="text-gray-500">Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Category</th>
                    <th className="text-left py-3 px-2">Location</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Price</th>
                    <th className="text-left py-3 px-2">Seats</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                      <td className="py-3 px-2 text-gray-500">#{ev.id}</td>
                      <td className="py-3 px-2 font-semibold text-white max-w-xs truncate">{ev.name}</td>
                      <td className="py-3 px-2 text-gray-400">{ev.category}</td>
                      <td className="py-3 px-2 text-gray-400">{ev.location}</td>
                      <td className="py-3 px-2 text-gray-400">{ev.eventDate}</td>
                      <td className="py-3 px-2 text-red-400 font-semibold">₹{ev.price}</td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold ${ev.availableSeats > 0 ? "text-green-400" : "text-red-400"}`}>
                          {ev.availableSeats}/{ev.totalSeats}
                        </span>
                      </td>
                      <td className="py-3 px-2 flex gap-2">
                        <button onClick={() => handleEdit(ev)}
                          className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                        <button onClick={() => handleDelete(ev.id)}
                          className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Add / Edit Form */}
        {tab === "add" && (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-5">{editing ? "Edit Event" : "Add New Event"}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name:"name",        label:"Event Name",    type:"text",   span:2 },
                { name:"category",    label:"Category",      type:"select", span:1 },
                { name:"location",    label:"Location",      type:"text",   span:1 },
                { name:"eventDate",   label:"Date",          type:"date",   span:1 },
                { name:"price",       label:"Price (₹)",     type:"number", span:1 },
                { name:"totalSeats",  label:"Total Seats",   type:"number", span:1 },
                { name:"availableSeats",label:"Available Seats",type:"number",span:1},
                { name:"image",       label:"Image URL",     type:"url",    span:2 },
                { name:"description", label:"Description",   type:"textarea",span:2},
              ].map(field => (
                <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                  <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={form[field.name]}
                      onChange={e => setForm(f => ({...f, [field.name]: e.target.value}))}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {["Movies","Sports","Music","Comedy","Theatre"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={form[field.name]}
                      onChange={e => setForm(f => ({...f, [field.name]: e.target.value}))}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.name]}
                      onChange={e => setForm(f => ({...f, [field.name]: e.target.value}))}
                      required={["name","location","eventDate","price","totalSeats"].includes(field.name)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button type="submit" className="btn-primary px-8">
                {editing ? "Update Event" : "Add Event"}
              </button>
              <button type="button"
                onClick={() => { setForm(EMPTY_FORM); setEditing(null); }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">
                Reset
              </button>
            </div>
          </form>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Event ID</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Seats</th>
                  <th className="text-left py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">No bookings yet.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-900 hover:bg-gray-900 transition">
                    <td className="py-3 px-2 text-gray-500">#{b.id}</td>
                    <td className="py-3 px-2 text-gray-400">#{b.eventId}</td>
                    <td className="py-3 px-2 text-white font-semibold">{b.userName}</td>
                    <td className="py-3 px-2 text-gray-400">{b.userEmail}</td>
                    <td className="py-3 px-2 text-blue-400">{b.seats}</td>
                    <td className="py-3 px-2 text-green-400 font-bold">₹{b.totalAmount}</td>
                    <td className="py-3 px-2">
                      <span className="bg-green-900 text-green-400 px-2 py-0.5 rounded-full text-xs">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
