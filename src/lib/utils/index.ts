export function formatDate(dateString: string) {
    // Convert the date string to a Date object
    const date = new Date(dateString);
  
    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensure day is 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is 2 digits (0-based)
    const year = date.getFullYear(); // Get the full year
  
    // Format the date as dd/mm/yyyy
    return `${day}/${month}/${year}`;
  }

  export function calculateDaysBetween(startDate: string | Date, endDate: string | Date): number {
    const start: Date = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end: Date = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }
  
    const timeDifference: number = end.getTime() - start.getTime();
  
    return Math.round(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  }
  