import moment from "moment/moment";

const FormatDate = function (date) {
  //Function to calculate the number of days passed
  const calcDaysPassed = (date1, date2) => Math.abs(date2.diff(date1, "days")); //24 hours

  //calling calcDaysPassed function for calculate.
  const daysPassed = calcDaysPassed(
    moment(), //current date
    moment(date.split(",")[0].trim()) //pass in date
  );

  //Checking for number of days passed
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  //if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return date;
  }
};
export default FormatDate;
