// components/buttons/Button.tsx
import React from "react";

export interface ButtonProps {
  buttonLabel: string;
  buttonBackgroundColor?: "emerald" | "amber" | "red" | "blue";
  onClick?: () => void;
  className?: string;
}

const colorMap: Record<NonNullable<ButtonProps["buttonBackgroundColor"]>, string> = {
  emerald: "bg-emerald-500 hover:bg-emerald-600 text-white",
  amber: "bg-amber-500 hover:bg-amber-600 text-white",
  red: "bg-rose-500 hover:bg-rose-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-600 text-white",
};

const Button: React.FC<ButtonProps> = ({
  buttonLabel,
  buttonBackgroundColor = "emerald",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition ${colorMap[buttonBackgroundColor]} ${className}`}
    >
      {buttonLabel}
    </button>
  );
};

export default Button;
