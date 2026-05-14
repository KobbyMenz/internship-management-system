import { forwardRef, useState } from "react";
import styles from "./PasswordInput.module.css";
import OpenEyeIcon from "../Icons/OpenEyeIcon";
import CloseEyeIcon from "../Icons/CloseEyeIcon";

const PasswordInput = forwardRef(({ id, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const togglePassword = () => setShow((prev) => !prev);

  return (
    <div className={styles.input_container}>
      <input
        className={styles.input}
        id={id}
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          props.onChange?.(e);
        }}
      />

      {hasValue && (
        <div onClick={togglePassword} className={styles.password__icon}>
          {show ? <CloseEyeIcon /> : <OpenEyeIcon />}
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
