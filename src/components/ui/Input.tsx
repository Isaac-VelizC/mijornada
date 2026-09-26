import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  icon?: React.ElementType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            {Icon && <Icon className="size-3.5 text-muted-foreground" />}
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
