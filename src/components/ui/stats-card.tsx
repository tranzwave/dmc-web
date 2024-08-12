"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const statsCardVariants = cva(
  "w-full border rounded-lg p-4",
  {
    variants: {
      variant: {
        default: "",
        custom: "text-[#697077] text-[24px]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const StatsCard = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof statsCardVariants> & {
      label: string;
      value: string | number;
    }
>(({ label, value, className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(statsCardVariants({ variant }), className)} {...props}>
    <p className="text-[#697077]">{label}</p>
    <p className="text-[24px]">{value}</p>
  </div>
));

StatsCard.displayName = "StatsCard";

export { StatsCard };

