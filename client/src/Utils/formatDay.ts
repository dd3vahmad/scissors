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
    ? days[
        (new Date(date).getDay() + 1 !== days.length &&
          new Date(date).getDay() + 1) ||
          0
      ].replace(/day/, "")
    : days[
        (new Date(date).getDay() + 1 !== days.length &&
          new Date(date).getDay() + 1) ||
          0
      ];
};

export default formatDay;
