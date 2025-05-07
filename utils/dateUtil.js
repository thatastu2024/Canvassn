import { format } from 'date-fns';
export const formatHumanReadableDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const now = new Date();
  
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    let dayLabel = isToday
      ? "Today"
      : isYesterday
      ? "Yesterday"
      : date.toLocaleDateString("en-US", { weekday: "long" });
  
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format; set to true for AM/PM
    });
  
    return `${dayLabel}, ${time}`;
  };

 export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  export const getUnixTime = () => Math.floor(Date.now() / 1000);

export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, 
  }).replace(",", "").replace("/", "-").replace("/", "-");
};


export const newFormatDateTime = (isoString) => {
  return format(new Date(isoString), 'd MMMM yyyy, HH:mm');
};

  