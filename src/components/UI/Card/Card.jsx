import { Fragment } from "react";
import PropTypes from "prop-types";
import classes from "./Card.module.css";

const Card = (props) => {
  return (
    <Fragment>
      <div
        id={props.id}
        style={props.style}
        className={`${classes.card} ${props.className}`}
      >
        {props.children}
      </div>
    </Fragment>
  );
};
Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  id: PropTypes.string,
};
export default Card;
