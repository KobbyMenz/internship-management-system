import moment from "moment";
import FormatDate from "./FormatDate";

const formatDateTime = (dateTime) => {
  const date = FormatDate(dateTime.split(" ")[0]);
  return date === "Today" || date === "Yesterday"
    ? `${date}, ${moment(dateTime).format("ddd, hh:mm:ss A")}`
    : moment(dateTime).format("MMM DD, YYYY, ddd, hh:mm:ss A");
};
export default formatDateTime;
