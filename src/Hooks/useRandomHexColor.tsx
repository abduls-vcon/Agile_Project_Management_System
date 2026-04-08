import { useMemo } from "react";

const useRandomHexColor = (): string => {
  const color = useMemo(
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0"),
    [],
  );
  return color;
};

export default useRandomHexColor;
