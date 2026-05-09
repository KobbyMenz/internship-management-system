// import React from "react";

import { Fragment } from "react";
import classes from "../MainHeader/Menu.module.css";
import PropTypes from "prop-types";

const Menu = (props) => {
  return (
    <Fragment>
      <div onClick={props.onClick} className={classes.menu__container}>
        <div
          className={props.toggleMenu ? `${classes.active}` : `${classes.menu}`}
        >
          <span className={classes.menu_span}></span>
          <span className={classes.menu_span}></span>
          <span className={classes.menu_span}></span>
        </div>
      </div>
    </Fragment>

    // <svg
    // 	className={classes.menu}
    // 	viewBox="0 0 24 24"
    // 	fill="currentColor"
    // 	height="1em"
    // 	width="1em"
    // 	// {...props}
    // >
    // 	<path d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
    // </svg>

    // <svg
    // 	className={classes.menu}
    // 	onClick={props.onClick}
    // 	viewBox="0 0 700 1000"
    // 	fill="currentColor"
    // 	height="1.2em"
    // 	width="1.2em"
    // 	// {...props}
    // >
    // 	<path d="M650 450c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50c-13.333 0-25-5-35-15S0 513.333 0 500c0-13.333 4.667-25 14-35s21.333-15 36-15h600M50 350c-13.333 0-25-5-35-15S0 313.333 0 300c0-13.333 4.667-25 14-35s21.333-15 36-15h600c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50m600 300c14.667 0 26.667 5 36 15 9.333 10 14 21.667 14 35 0 13.333-5 25-15 35s-21.667 15-35 15H50c-13.333 0-25-5-35-15S0 713.333 0 700c0-13.333 4.667-25 14-35s21.333-15 36-15h600" />
    // </svg>
  );
};
Menu.propTypes = {
  toggleMenu: PropTypes.bool,
  onClick: PropTypes.func,
};
export default Menu;
