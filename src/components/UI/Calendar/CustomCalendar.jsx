import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.css"

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Calendar className="" onChange={setDate} value={date} />
    </>
  );
};
export default CustomCalendar;
