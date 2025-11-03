import { useAuth } from "./useAuth";
import { getBusinessTypeConfig } from "../Data/BusinessTypeLabel";

export const useBusinessType = (bt) => {
  const authContext = useAuth();
  let config;
  let finalBusinessType;

  if (!authContext) {
    config = getBusinessTypeConfig(bt);
    finalBusinessType = bt;
  } else {
    const { businessType: authBusinessType } = authContext;
    config = getBusinessTypeConfig(authBusinessType);
    finalBusinessType = authBusinessType;
  }

  return {
    businessType: finalBusinessType,
    config,
    getStatusLabel: (status) => config?.status?.[status] || status,
    getCustomerLabel: (plural = true) =>
      plural ? config?.customerLabel : config?.customerSingularLabel,
  };
};
