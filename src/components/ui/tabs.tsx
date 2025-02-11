"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  Check,
  ClipboardType,
  LoaderCircle,
  LockIcon
} from "lucide-react"; // Importing icons
import * as React from "react";
import { cn } from "~/lib/utils";

type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> & {
  statusLabel?: string;
  isCompleted?: boolean;
  inProgress?: boolean;
  icon?: React.ReactNode;
};

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("flex", className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    {
      className,
      children,
      statusLabel = "",
      isCompleted = false,
      inProgress = false,
      icon,
      ...props
    },
    ref,
  ) => {
    // Ref to the underlying DOM element
    const localRef = React.useRef<HTMLElement | null>(null);
    return (
      <TabsPrimitive.Trigger
        ref={(node) => {
          // Set the ref to both localRef and forwarded ref
          localRef.current = node as HTMLElement;
          if (ref) {
            // @ts-ignore: TypeScript may complain here
            (ref as React.RefObject<typeof TabsPrimitive.Trigger>).current =
              node;
          }
        }}
        className={cn(
          "relative flex w-full flex-col items-start justify-center px-4 py-2 text-sm font-medium",
          "border border-gray-300",
          "data-[state=active]:bg-secondary-green/60 data-[state=active]:text-green-700",
          className,
        )}
        {...props}
      >
        <div className="flex items-start">
          {isCompleted ? (
            inProgress ? (
              <LoaderCircle className="mr-2 text-primary-green" size={16} />
              
            ) : (
              <Check
                className="mr-2 text-primary-green data-[state=active]:bg-red-600"
                size={16}
              />
            )
          ) : statusLabel === "Mandatory" ? (
            <LoaderCircle className="mr-2 text-primary-green" size={16} />
          ) : statusLabel === "Locked" ? (
            <LockIcon className="mr-2 text-primary-green" size={16} />
          ) : icon ? (
            icon
          ) : (
            <ClipboardType className="mr-2 text-primary-green" size={16} />
          )}
          <div className=" flex flex-col items-start">
            <div>{children}</div>
            <p className="text-xs text-gray-500">{statusLabel}</p>
          </div>
        </div>
        
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };

