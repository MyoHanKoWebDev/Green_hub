export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Check if date is valid to prevent "Invalid Date" text
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",   // "Jan"
    day: "numeric",   // "3"
    year: "numeric",  // "2026"
    hour: "numeric",  // "9"
    minute: "numeric",// "20"
    hour12: true,     // "PM"
  }).format(date);
};