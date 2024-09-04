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