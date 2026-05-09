import { Box } from "@mui/material";
import { useState, useEffect } from "react";

//import moment from "moment/moment";

export default function DigitalClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now
          .toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .replace(/am|pm/, (match) => match.toUpperCase()), // Ensure AM/PM is uppercase
      );
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        fontFamily: "monospace",
        fontSize: "2.5rem",
        fontWeight: "bold",
        display: "inline-block",
        // justifyContent: "center",
        // alignItems: "center",
        // flexWrap: "nowrap",
        // flexDirection: "column",
        backgroundColor: "var(--primary)",
        color: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "1rem",
        letterSpacing: "0.2rem",
        outline: "0.2rem solid var(--border-color)",
        // boxShadow: "0rem 0.2rem 0.4rem rgba(0, 0, 0, 0.26)",
        outlineOffset: "0.3rem",
      }}
    >
      {time}
      {/* <small style={{fontSize:"1.5rem",marginTop:"-1rem"}}> {moment().format("MMMM DD, YYYY, ddd")}</small> */}
    </Box>
  );
}
