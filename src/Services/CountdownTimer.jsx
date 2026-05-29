import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classes from "../components/UI/Modal/LockoutModal.module.css"; // ✅ Fix 1

const STORAGE_KEY = "LOCKOUT_TIMESTAMP_KEY";

export default function CountdownTimer({ onCloseModal }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = parseInt(raw); // ✅ Fix 2 — no JSON.parse needed

      if (!isNaN(saved) && saved > 0) {
        setTimeLeft(saved);
      } else {
        // ✅ Fallback to 15 minutes if nothing saved
        const fallback = 15 * 60;
        localStorage.setItem(STORAGE_KEY, fallback);
        setTimeLeft(fallback);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ✅ Fix 3 — close modal in useEffect, not during render
  useEffect(() => {
    if (timeLeft === 0) {
      localStorage.removeItem(STORAGE_KEY);
      onCloseModal();
    }
  }, [timeLeft, onCloseModal]);

  // ✅ Fix 4 — empty deps so interval starts once and never restarts
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        localStorage.setItem(STORAGE_KEY, next);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft]); // ✅ runs once only

  // ✅ Fix 5 — guard against null
  const formatTime = (secs) => {
    if (secs === null) return "00:00";
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = timeLeft !== null && timeLeft < 120;

  return (
    <h2 className={`${classes.timer} ${isLowTime ? classes.timerWarning : ""}`}>
      {formatTime(timeLeft)}
    </h2>
  );
}

CountdownTimer.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import classes from "../components/UI/Modal/LockoutModal.module.css";

// const STORAGE_KEY = "LOCKOUT_TIMESTAMP_KEY";

// export default function CountdownTimer({ onCloseModal }) {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const intervalRef = useRef(null);

//   // useEffect(() => {
//   //   const saved = parseInt(JSON.parse(localStorage.getItem(STORAGE_KEY)));

//   //   if (!isNaN(saved) && saved > 0) {
//   //     setTimeLeft(saved);
//   //   }
//   // }, []);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       const saved = parseInt(JSON.parse(raw));

//       if (!isNaN(saved) && saved > 0) {
//         setTimeLeft(saved);
//       }
//     } catch {
//       localStorage.removeItem(STORAGE_KEY); // clear the corrupted value
//     }
//   }, []);

//   // Auto-start countdown whenever timeLeft is set
//   useEffect(() => {
//     if (timeLeft === null || timeLeft <= 0) return;

//     intervalRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         const next = prev - 1;
//         // Update localStorage as it counts down
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

//         if (next <= 0) {
//           clearInterval(intervalRef.current);
//           return 0;
//         }
//         return next;
//       });
//     }, 1000);

//     return () => clearInterval(intervalRef.current);
//   }, [
//     timeLeft,
//     // === null
//   ]); // only re-run when timeLeft goes from null → a value

//   const formatTime = (secs) => {
//     // const h = Math.floor(secs / 3600)
//     //   .toString()
//     //   .padStart(2, "0");
//     const m = Math.floor((secs % 3600) / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (secs % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // if (timeLeft === null) return <p>No timer found in localStorage.</p>;
//   if (timeLeft === 0) {
//     onCloseModal();
//   }

//   // Add warning class if time is running out (less than 2 minutes)
//   const isLowTime = timeLeft < 120;

//   return (
//     // <div>
//     <h2 className={`${classes.timer} ${isLowTime ? classes.timerWarning : ""}`}>
//       {formatTime(timeLeft)}
//     </h2>
//     // </div>
//   );
// }
// CountdownTimer.propTypes = {
//   onCloseModal: PropTypes.func.isRequired,
// };
