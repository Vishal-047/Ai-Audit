import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyle = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
    glass: "bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
