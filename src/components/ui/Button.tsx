import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      loading,
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-medium transition-colors disabled:opacity-50";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2",
      outline: "border border-border text-foreground hover:bg-muted px-4 py-2",
      ghost: "text-foreground hover:bg-muted px-3 py-1.5",
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
