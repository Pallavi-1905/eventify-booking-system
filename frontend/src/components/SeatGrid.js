import { useState } from "react";

export default function SeatGrid({ totalSeats, bookedSeats = [], onSelectionChange }) {
  const [selected, setSelected] = useState([]);

  const toggle = (num) => {
    if (bookedSeats.includes(num)) return;
    const next = selected.includes(num)
      ? selected.filter(s => s !== num)
      : [...selected, num];
    setSelected(next);
    onSelectionChange(next);
  };

  const rows = [];
  const perRow = 10;
  for (let r = 0; r < Math.ceil(totalSeats / perRow); r++) {
    rows.push({ label: String.fromCharCode(65 + r), seats: [] });
    for (let c = 1; c <= perRow; c++) {
      const num = r * perRow + c;
      if (num <= totalSeats) rows[r].seats.push(num);
    }
  }

  return (
    <div className="w-full">
      {/* Screen */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mb-2" />
        <p className="text-gray-500 text-xs tracking-widest">SCREEN</p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center mb-6 text-xs">
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-500 inline-block"/>Available</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500 inline-block"/>Selected</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-600 inline-block"/>Booked</span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        {rows.map(row => (
          <div key={row.label} className="flex items-center gap-1 mb-1 justify-center">
            <span className="text-gray-500 text-xs w-5 text-right mr-1">{row.label}</span>
            {row.seats.map(num => {
              const isBooked   = bookedSeats.includes(num);
              const isSelected = selected.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggle(num)}
                  disabled={isBooked}
                  title={`Seat ${row.label}${num}`}
                  className={`w-7 h-7 text-xs rounded font-medium transition-transform hover:scale-110
                    ${isBooked   ? "seat-booked"    : ""}
                    ${isSelected ? "seat-selected"  : ""}
                    ${!isBooked && !isSelected ? "seat-available" : ""}
                  `}
                >
                  {num}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <p className="text-center text-sm text-red-400 font-semibold mt-4">
          {selected.length} seat(s) selected: {selected.join(", ")}
        </p>
      )}
    </div>
  );
}
