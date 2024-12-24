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

export function getLetterByIndex(index: number): string {
  if(index == 0) {
    return '';
  }
  if (index < 0) {
      // throw new Error("Index must be a positive integer.");
      return '';
  }

  const letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  while (index > 0) {
      index--; // Adjust index to make it 0-based
      result = letters[index % 26] + result;
      index = Math.floor(index / 26);
  }

  return `/${result}`;
}


/**
 * Calculates the number of nights between two dates.
 * @param checkIn - The check-in date as a string or Date object.
 * @param checkOut - The check-out date as a string or Date object.
 * @returns The number of nights between the check-in and check-out dates.
 */
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  // Convert inputs to Date objects if they are strings
  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut;

  // Calculate the difference in milliseconds
  const differenceInMillis = checkOutDate.getTime() - checkInDate.getTime();

  // Convert milliseconds to days (1 day = 86,400,000 milliseconds)
  const nights = differenceInMillis / (1000 * 60 * 60 * 24);

  // Ensure nights is a positive integer
  if (nights < 0) {
    throw new Error("Check-out date must be after the check-in date.");
  }

  return Math.floor(nights);
}
