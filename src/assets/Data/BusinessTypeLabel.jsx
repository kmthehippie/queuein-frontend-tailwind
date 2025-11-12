export const BUSINESS_TYPES = {
  RESTAURANT: "RESTAURANT",
  CLINIC: "CLINIC",
  CAFE: "CAFE",
  EVENTS: "EVENTS",
  BASIC: "BASIC",
};

export const businessTypeConfig = {
  [BUSINESS_TYPES.RESTAURANT]: {
    label: "Restaurant",
    value: "RESTAURANT",
    queueName: "Outlet",
    customerLabel: "Customers",
    customerSingularLabel: "Customer",
    listTitle: "Customer List",
    status: {
      CALLED: "Called",
      SEATED: "Seated",
      NO_SHOW: "No-Show",
    },
  },
  [BUSINESS_TYPES.CLINIC]: {
    label: "Clinic",
    value: "CLINIC",
    queueName: "Doctor",
    customerLabel: "Patients",
    customerSingularLabel: "Patient",
    listTitle: "Patient List",
    status: {
      CALLED: "Called",
      SEATED: "Seen",
      NO_SHOW: "No-Show",
    },
  },
  [BUSINESS_TYPES.CAFE]: {
    label: "Cafe",
    value: "CAFE",
    queueName: "Outlet",
    customerLabel: "Customers",
    customerSingularLabel: "Customer",
    listTitle: "Customer List",
    status: {
      CALLED: "Called",
      SEATED: "Collected",
      NO_SHOW: "No-Show",
    },
  },
  [BUSINESS_TYPES.EVENTS]: {
    label: "Event Location",
    value: "EVENTS",
    queueName: "Location",
    customerLabel: "Attendees",
    customerSingularLabel: "Attendee",
    listTitle: "Attendee List",
    status: {
      CALLED: "Called",
      SEATED: "Admitted",
      NO_SHOW: "No-Show",
    },
  },
  [BUSINESS_TYPES.BASIC]: {
    label: "Basic",
    value: "BASIC",
    queueName: "Location",
    customerLabel: "Queuers",
    customerSingularLabel: "Queuer",
    listTitle: "Queue List",
    status: {
      CALLED: "Called",
      SEATED: "Completed",
      NO_SHOW: "No-Show",
    },
  },
};

export const getBusinessTypeConfig = (businessType) => {
  return (
    businessTypeConfig[businessType] || businessTypeConfig[BUSINESS_TYPES.BASIC]
  );
};
