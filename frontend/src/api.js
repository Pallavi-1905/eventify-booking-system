import axios from "axios";

const API = axios.create({
  baseURL: "https://eventify-booking-backend.onrender.com",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const fetchEvents           = ()           => API.get("/events");
export const fetchEventById        = (id)         => API.get(`/events/${id}`);
export const fetchEventsByCategory = (cat)        => API.get(`/events/category/${cat}`);
export const fetchEventsByLocation = (loc)        => API.get(`/events/location/${loc}`);
export const createEvent           = (data)       => API.post("/events", data);
export const updateEvent           = (id, data)   => API.put(`/events/${id}`, data);
export const deleteEvent           = (id)         => API.delete(`/events/${id}`);
export const fetchBookings         = ()           => API.get("/bookings");
export const createBooking         = (data)       => API.post("/bookings", data);
export const getRecommendations    = (data)       => API.post("/events/recommend", data);
export const chatWithAI            = (message)    => API.post("/events/chat", { message });

export default API;
