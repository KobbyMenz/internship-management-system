import { useTimer } from "react-timer-hook";
import { useEffect, useCallback, useState } from "react";

const useLogoutTimer = (logoutTime, onExpireCallback) => {
  const [render, setRender] = useState(false);
  //const [storedExpiry, setStoredExpiry] = useState(new Date());
  //creating an expire timestamp
  const initialExpiry = new Date();
  initialExpiry.setHours(initialExpiry.getHours() + logoutTime);

  const { hours, minutes, seconds, restart, pause } = useTimer({
    expiryTimestamp: initialExpiry,
    onExpire: onExpireCallback, //callback to execute om timer expiry
    autoStart: false, //not starting until timer starts running
  });

  //Function to start/restart the timer
  const startTimer = useCallback(() => {
    const newExpiry = new Date();
    // const newExpiry = storedExpiry;

    newExpiry.setHours(newExpiry.getHours() + logoutTime);
    restart(newExpiry);
    //localStorage.setItem("expiryTime", newExpiry); // Store expiry time in localStorage
  }, [logoutTime, restart]);

  useEffect(() => {
    //setStoredExpiry(new Date(JSON.parse(localStorage.getItem("expiryTime"))));

    startTimer();
  }, [render, startTimer, logoutTime]);

  //Function to stop the timer
  const stopTimer = useCallback(() => {
    pause();
  }, [pause]);

  return { hours, minutes, seconds, startTimer, stopTimer, setRender };
};
export default useLogoutTimer;
