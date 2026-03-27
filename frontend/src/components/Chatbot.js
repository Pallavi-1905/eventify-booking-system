import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../api";

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm Eventify AI 🎟️ Ask me about events by city, category, or price!" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await chatWithAI(userMsg);
      setMessages(m => [...m, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages(m => [...m, { from: "bot", text: "AI service is offline. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter") send(); };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-110"
        title="AI Chatbot"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <p className="font-bold text-sm">Eventify AI</p>
              <p className="text-xs text-red-200">Ask me anything!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} chatbot-bubble`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm
                  ${m.from === "user"
                    ? "bg-red-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-3 py-2 rounded-xl text-gray-400 text-sm">Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about events..."
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button onClick={send} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-sm font-bold">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
