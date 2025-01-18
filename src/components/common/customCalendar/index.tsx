import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  start: string;
  end: string;
  color?: string;
}

interface CalendarProps {
  dateRanges?: DateRange[];
}

export const CalendarV2: React.FC<CalendarProps> = ({ dateRanges }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const initialDate = dateRanges?.[0]?.start ? new Date(dateRanges[0].start) : new Date();
    return isNaN(initialDate.getTime()) ? new Date() : initialDate; // Fallback to current date if invalid
  });
  
  const [weeks, setWeeks] = useState<Date[][]>([]);

  // Generate the calendar days for the current month
  useEffect(() => {
    const startDate = startOfWeek(startOfMonth(currentMonth))
    const endDate = endOfWeek(endOfMonth(currentMonth));

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    setWeeks(weeks);
  }, [currentMonth, dateRanges]);

  // Check if a date is within any of the provided date ranges
  const isHighlighted = (day: Date): boolean => {
    if (dateRanges) {
      return dateRanges.some((range) =>
        isWithinInterval(day, {
          start: new Date(range.start),
          end: new Date(range.end),
        }),
      );
    }
    return false;
  };

  const getHighlightColor = (day: Date): string => {
    if (!dateRanges || dateRanges.length === 0) {
      return "bg-white text-neutral-700"; // Default if dateRanges is undefined or empty
    }
  
    // Check for child ranges that overlap with the day
    const childRange = dateRanges.slice(1).find(range =>
      isWithinInterval(new Date(day).setHours(0, 0, 0, 0), { start: new Date(range.start).setHours(0, 0, 0, 0), end: new Date(range.end).setHours(0, 0, 0, 0) })
    );
  
    // If a child range is found, highlight it
    if (childRange) {
      return childRange.color ?? "bg-primary-orange text-white"; // Highlight child range if present
    }
  
    // Proceed to check the main range if no child range is found
    const mainRange = dateRanges[0]; // First range as the main range
  
    // Ensure that mainRange is valid
    if (!mainRange) {
      return "bg-white text-neutral-700"; // Return default if mainRange is undefined
    }
  
    const isInMainRange = isWithinInterval(
      new Date(day).setHours(0, 0, 0, 0), // set time to midnight for 'day'
      {
        start: new Date(mainRange.start).setHours(0, 0, 0, 0),
        end: new Date(mainRange.end).setHours(0, 0, 0, 0),
      }
    );
  
    // Determine the color based on whether we're in the main range
    return isInMainRange
      ? mainRange.color ?? "bg-primary-green text-white" // Highlight main range if no child range
      : "bg-white text-neutral-700"; // Default color
  };
  
  
  
  
  

  const renderDay = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const highlightColor = getHighlightColor(day);

    const isCurrentMonth =
      day.getMonth() === currentMonth.getMonth() &&
      day.getFullYear() === currentMonth.getFullYear();

    return (
      <div
        key={day.toString()}
        className={`flex aspect-square w-[35px] cursor-pointer items-center justify-center text-center text-sm font-normal 
        ${highlightColor} 
        ${isCurrentMonth ? "" : "opacity-40"}
        ${isToday ? "border-2 border-neutral-600 font-bold" : ""} `}
      >
        {format(day, "d")}
      </div>
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <ChevronLeft
          size={15}
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          className="hover:cursor-pointer"
        />
        <h2 className="text-base font-medium text-neutral-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <ChevronRight
          size={15}
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          className="hover:cursor-pointer"
        />
        {/* <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
        >
          Previous
        </button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
        >
          Next
        </button> */}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-light text-neutral-400"
          >
            {day}
          </div>
        ))}
        {weeks.map((week, idx) => (
          <React.Fragment key={idx}>
            {week.map((day) => renderDay(day))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
