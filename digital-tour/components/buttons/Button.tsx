// components/buttons/Button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-60 active:scale-95",
  {
    variants: {
      variant: {
        solid: "text-white shadow-lg hover:shadow-xl",
        outline: "border-2 bg-transparent hover:bg-white/10",
        ghost: "bg-transparent hover:bg-white/10",
        link: "bg-transparent underline-offset-4 hover:underline",
      },
      intent: {
        // ← Renamed from "color" to "intent" to avoid conflict
        emerald: "",
        amber: "",
        red: "",
        neutral: "",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
      },
    },
    compoundVariants: [
      // Solid
      {
        variant: "solid",
        intent: "emerald",
        class: "bg-emerald-600 hover:bg-emerald-700",
      },
      {
        variant: "solid",
        intent: "amber",
        class: "bg-amber-500 hover:bg-amber-600",
      },
      {
        variant: "solid",
        intent: "red",
        class: "bg-rose-600 hover:bg-rose-700",
      },
      {
        variant: "solid",
        intent: "neutral",
        class: "bg-slate-700 hover:bg-slate-800",
      },

      // Outline
      {
        variant: "outline",
        intent: "emerald",
        class:
          "border-emerald-600 text-emerald-600 hover:text-white hover:bg-emerald-600",
      },
      {
        variant: "outline",
        intent: "amber",
        class:
          "border-amber-500 text-amber-500 hover:text-white hover:bg-amber-500",
      },
      {
        variant: "outline",
        intent: "red",
        class:
          "border-rose-600 text-rose-600 hover:text-white hover:bg-rose-600",
      },
      {
        variant: "outline",
        intent: "neutral",
        class:
          "border-slate-600 text-slate-600 hover:text-white hover:bg-slate-600",
      },

      // Ghost
      {
        variant: "ghost",
        intent: "emerald",
        class: "text-emerald-600 hover:text-emerald-700",
      },
      {
        variant: "ghost",
        intent: "amber",
        class: "text-amber-600 hover:text-amber-700",
      },
      {
        variant: "ghost",
        intent: "red",
        class: "text-rose-600 hover:text-rose-700",
      },
      {
        variant: "ghost",
        intent: "neutral",
        class: "text-slate-600 hover:text-slate-700",
      },

      // Link
      {
        variant: "link",
        intent: "emerald",
        class: "text-emerald-600 hover:text-emerald-700",
      },
      {
        variant: "link",
        intent: "amber",
        class: "text-amber-600 hover:text-amber-700",
      },
      {
        variant: "link",
        intent: "red",
        class: "text-rose-600 hover:text-rose-700",
      },
      {
        variant: "link",
        intent: "neutral",
        class: "text-slate-600 hover:text-slate-700",
      },
    ],
    defaultVariants: {
      variant: "solid",
      intent: "emerald",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      intent,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({ variant, intent, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
