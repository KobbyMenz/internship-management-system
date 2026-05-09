import { useTimer } from "react-timer-hook";
import PropTypes from "prop-types";
import styles from "../Functions/LogoutTimer.module.css";
const LogoutTimer = ({ expiryTimestamp, onExpire }) => {
  const {
    seconds,
    minutes,
    hours,

    // days,
    // milliseconds,

    // isRunning,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      onExpire();
    },
  });

  return (
    <>
      <p className={styles.timer_container}>
        <span className={styles.span_1}>System logs out in:&nbsp;</span>
        <div>
          <span className={styles.timer}>
            {hours.toString().padStart(2, "0")}:
          </span>{" "}
          <span className={styles.timer}>
            {minutes.toString().padStart(2, "0")}:
          </span>{" "}
          <span className={styles.timer}>
            {seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </p>
    </>
  );
};

LogoutTimer.propTypes = {
  expiryTimestamp: PropTypes.object,
  onExpire: PropTypes.func,
};
export default LogoutTimer;
