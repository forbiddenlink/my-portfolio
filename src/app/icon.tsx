import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030014",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            background: "rgba(168, 85, 247, 0.4)",
            filter: "blur(8px)",
          }}
        />
        
        {/* Outer diamond */}
        <div
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            border: "2px solid rgba(168, 85, 247, 0.8)",
            transform: "rotate(45deg)",
            borderRadius: "2px",
          }}
        />

        {/* Inner bright core */}
        <div
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            background: "#06b6d4",
            transform: "rotate(45deg)",
            boxShadow: "0 0 8px #06b6d4",
            borderRadius: "1px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
