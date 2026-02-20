import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030014", // Solid dark space fallback
          backgroundImage: "linear-gradient(to bottom right, #030014, #0f0b29)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Inner grid noise simulation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.5,
          }}
        />

        {/* Magenta/Purple Glow */}
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Outer Ring */}
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            border: "4px solid rgba(168, 85, 247, 0.4)",
            transform: "rotate(45deg)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              width: "70px",
              height: "70px",
              border: "3px solid rgba(6, 182, 212, 0.6)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-45deg)", // Counter rotate
            }}
          >
            {/* Core */}
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "#06b6d4", // Fallback
                backgroundImage: "linear-gradient(135deg, #06b6d4, #a855f7)",
                borderRadius: "6px",
                boxShadow: "0 0 20px #06b6d4",
                transform: "rotate(45deg)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
