export default function formatDate(dateString: string) {
  "worklet";

  if (
    !dateString ||
    typeof dateString !== "string" ||
    dateString.length !== 10
  ) {
    return "";
  }

  const yearStr = dateString.substring(0, 4);
  const monthStr = dateString.substring(5, 7);
  const dayStr = dateString.substring(8, 10);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = parseInt(monthStr, 10) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return dateString;
  }

  const monthName = monthNames[monthIndex];

  return `${monthName} ${parseInt(dayStr, 10)}, ${yearStr}`;
}
