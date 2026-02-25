import { useMemo } from "react";

export const useDateFormat = (date: string | Date | undefined) => {
  const formattedDate = useMemo(() => {
    if (!date) return "";

    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }, [date]);

  return formattedDate;
};


export default useDateFormat;