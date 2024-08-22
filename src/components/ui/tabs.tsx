"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Check, Circle, LoaderCircle } from "lucide-react"; // Importing icons
import * as React from "react";
import { cn } from "~/lib/utils";

type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  statusLabel?: string;
};

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex", 
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, statusLabel = "", ...props }, ref) => {
  const isCompleted = true;
  const isLoading = false;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative flex flex-col items-start justify-between px-4 py-2 text-sm font-medium w-full", // Align icons and text horizontally
        "border border-gray-300",
        "data-[state=active]:bg-secondary-green/60 data-[state=active]:text-green-700", // Active tab styles
        className
      )}
      {...props}
    >
      <div className="flex items-center">
        {isCompleted ? (
          <Check className="mr-2 text-primary-green" size={16} />
        ) : isLoading ? (
          <LoaderCircle className="mr-2 animate-spin text-primary-green" size={16} />
        ) : (
          <Circle className="mr-2 text-primary-green" size={16} />
        )}
        <span>{children}</span>
      </div>
      <p className="ml-6 text-xs text-gray-500">{statusLabel}</p>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };

