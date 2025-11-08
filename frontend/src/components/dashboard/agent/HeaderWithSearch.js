"use client";
export function HeaderWithSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="flex items-center gap-4 justify-between">
      <h2
        className="font-semibold text-neutral-900"
        style={{
          fontFamily: "Montserrat",
          fontWeight: 600,
          fontSize: "14.93px",
          lineHeight: "100%",
          letterSpacing: "0%",
          width: "139px",
          height: "18px",
        }}
      >
        My Property Bank
      </h2>

      {/* Search Bar */}
      <div className="relative flex-1 h-8">
        <svg
          className="absolute left-[19.69px] top-1/2 -translate-y-1/2 w-[13.29px] h-[13.29px] text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, address, status, or price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-full pl-11 pr-5 text-sm rounded-[9.85px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          style={{
            borderWidth: "0.98px",
            borderColor: "#d1d5db",
            borderStyle: "solid",
            color: "#374151",
          }}
        />
      </div>
    </div>
  );
}
