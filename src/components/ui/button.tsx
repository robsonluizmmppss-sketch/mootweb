import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botão base do design system MootWeb.
 * Use `buttonVariants()` para estilizar <Link> com a mesma aparência.
 */
export const buttonVariants = cva(
  "inline-flex max-w-full items-center justify-center gap-2 rounded-full text-center text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-glow-sm hover:shadow-glow hover:brightness-110 active:scale-[0.98]",
        gradient:
          "text-white bg-[linear-gradient(120deg,#2563EB,#3B82F6_50%,#60A5FA)] bg-[length:200%_auto] hover:bg-[position:right_center] shadow-glow-sm hover:shadow-glow active:scale-[0.98]",
        secondary:
          "glass text-foreground hover:bg-white/[0.08] hover:border-white/20",
        outline:
          "border border-white/15 bg-transparent text-foreground hover:bg-white/5 hover:border-white/25",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-white/5",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base [&_svg]:size-5",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
