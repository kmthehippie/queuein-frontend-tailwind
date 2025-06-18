import { useContext } from "react";
import LocalStorageContext from "../context/LocalStorageContext";

const useLSContext = () => {
  return useContext(LocalStorageContext);
};

export default useLSContext;
