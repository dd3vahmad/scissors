const formatDay = (date: Date, inShortForm: boolean) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return inShortForm
    ? days[new Date(date).getDay() + 1].replace(/day/, "")
    : "a";
};

export default formatDay;
