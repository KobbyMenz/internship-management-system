import { forwardRef } from "react";
import PropTypes from "prop-types";
import classes from "../../UI/Button/Button.module.css";

const Button = forwardRef((props, ref) => {
  const {
    className = "",
    type,
    onClick,
    disabled,
    id,
    style,
    children,
    ...rest
  } = props;

  return (
    <button
      ref={ref}
      className={`${classes.button} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
});
Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  style: PropTypes.object,
};
// Give the forwarded component a display name for eslint/react
Button.displayName = "Button";

export default Button;
