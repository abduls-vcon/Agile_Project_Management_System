import { useState, useEffect } from "react";

const useDateAndTime = (intervalTime: number = 1000): Date => {
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setTime(new Date());
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);

  return time;
};

export default useDateAndTime;