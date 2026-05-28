import dayjs from "dayjs";

export default function formatDateTime(date) {
  const inputDate = dayjs(date);
  const now = dayjs();

  if (inputDate.isSame(now, "day")) {
    return `Today, ${inputDate.format("ddd @ hh:mm a")}`;
  }

  if (inputDate.isSame(now.subtract(1, "day"), "day")) {
    return `Yesterday, ${inputDate.format("ddd @ hh:mm a")}`;
  }

  return inputDate.format("ddd, DD MMM, YYYY @ hh:mm a");
}
