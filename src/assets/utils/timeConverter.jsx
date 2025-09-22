export const msToMins = (milliseconds) => {
  if (typeof milliseconds !== "number") {
    // Or handle this case by returning 0 or throwing a more specific error for the UI
    return 0; // Or throw new TypeError("Input must be a number");
  }
  if (milliseconds < 0) {
    return 0; // Or throw new RangeError("Input must be a non-negative number");
  }
  return milliseconds / (1000 * 60);
};

export const minsToMs = (mins) => {
  // Assuming validation for number and non-negativity is done before calling this
  return mins * 60 * 1000;
};

export const formatMilliseconds = (milliseconds, activeItems) => {
  console.log(milliseconds, activeItems);
  if (activeItems < 0) {
    return `1 minute`;
  }
  const minutes = Math.round(milliseconds / 60000) * activeItems;

  // Return the result with the correct pluralization.
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};
