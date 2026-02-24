"use client";

/* Hero background for the landing / connect page — clean, professional */
export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient — very light warm white */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#FEF2F2]" />

      {/* Subtle red glow top-right */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      {/* Subtle dark glow bottom-left */}
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(15,23,42,0.04) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "float 10s ease-in-out infinite 2s",
        }}
      />

      {/* Decorative geometric grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F172A" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Accent arc bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        style={{ opacity: 0.04 }}
      >
        <path
          fill="#DC2626"
          d="M0,100 C360,180 1080,20 1440,100 L1440,180 L0,180 Z"
        />
      </svg>
    </div>
  );
}

/* Sidebar background — dark navy */
export function SidebarBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0F172A]" />
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
