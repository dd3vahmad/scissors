const formatDay = (index: number, inShortForm: boolean) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return inShortForm ? days[index].replace(/day/, "") : days[index];
};

export default formatDay;
