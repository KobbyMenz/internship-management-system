import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classes from "../components/UI/Modal/LockoutModal.module.css";

const STORAGE_KEY = "LOCKOUT_TIMESTAMP_KEY";

export default function CountdownTimer({ onCloseModal }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = parseInt(JSON.parse(localStorage.getItem(STORAGE_KEY)));

    if (!isNaN(saved) && saved > 0) {
      setTimeLeft(saved);
    }
  }, []);

  // Auto-start countdown whenever timeLeft is set
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        // Update localStorage as it counts down
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        if (next <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [
    timeLeft,
    // === null
  ]); // only re-run when timeLeft goes from null → a value

  const formatTime = (secs) => {
    // const h = Math.floor(secs / 3600)
    //   .toString()
    //   .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // if (timeLeft === null) return <p>No timer found in localStorage.</p>;
  if (timeLeft === 0) {
    onCloseModal();
  }

  // Add warning class if time is running out (less than 2 minutes)
  const isLowTime = timeLeft < 120;

  return (
    // <div>
    <h2 className={`${classes.timer} ${isLowTime ? classes.timerWarning : ""}`}>
      {formatTime(timeLeft)}
    </h2>
    // </div>
  );
}
CountdownTimer.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};
