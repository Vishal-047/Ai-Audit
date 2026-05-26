import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2.5 text-sm font-medium tracking-tight rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-900 border border-black focus:ring-black",
    secondary: "bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 focus:ring-zinc-400",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/50 hover:text-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 focus:ring-zinc-300",
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
