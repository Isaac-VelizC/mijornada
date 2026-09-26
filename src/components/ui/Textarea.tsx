import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  icon?: React.ElementType;
  optionalText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, icon: Icon, optionalText, className = "", id, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            {Icon && <Icon className="size-3.5 text-muted-foreground" />}
            {label}
            {optionalText && (
              <span className="font-normal text-muted-foreground text-[11px]">
                ({optionalText})
              </span>
            )}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
