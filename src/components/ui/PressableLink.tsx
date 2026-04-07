"use client";

import { useState } from "react";

type PressableButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function PressableButton({
  type = "button",
  onClick,
  className = "",
  children,
  ariaLabel,
}: PressableButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      aria-label={ariaLabel}
      className={`${className} transition-all duration-100 ${
        pressed
          ? "scale-90 brightness-125 ring-2 ring-red-400/50"
          : "scale-100"
      }`}
      style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.18)" }}
    >
      {children}
    </button>
  );
}