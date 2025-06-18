// src/utils/localStorage.js

export const setWithExpiry = (key, value, ttl_ms) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl_ms,
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error setting localStorage item:", error);
  }
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      console.log("The time Now is more than expiry time");
      localStorage.removeItem(key); // Remove expired item
      return null;
    }
    return item.value;
  } catch (error) {
    console.error("Error parsing or getting localStorage item:", error);
    localStorage.removeItem(key); // Clean up potentially corrupted data
    return null;
  }
};

export const removeLocalStorageItem = (key) => {
  localStorage.removeItem(key);
};
