"use client";

export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-abobi-midnight via-[#1a0640] to-black" />

      {/* Slow wave layer 1 */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        style={{ animation: "wave-slow 8s ease-in-out infinite" }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(107,70,193,0.4)"
          d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z"
        />
      </svg>

      {/* Medium wave layer 2 */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-15"
        style={{ animation: "wave-med 6s ease-in-out infinite" }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(124,58,237,0.35)"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,320L0,320Z"
        />
      </svg>

      {/* Ambient purple glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,1) 0%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, rgba(107,70,193,1) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite 2s",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
