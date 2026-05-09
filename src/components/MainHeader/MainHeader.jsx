import classes from "./MainHeader.module.css";
import logo from "../../assets/cropped-AAMUSTED-LOGO.jpg";
import Navigation from "./Navigation";
import PropTypes from "prop-types";
//import { useNavigate } from "react-router-dom";
// import Menu from "./M";
// import Button from "../UI/Button";

const MainHeader = (props) => {
  // const navigate = useNavigate();
  // const goToAdmin = () => {
  //   navigate("/adminDashboard");
  // };

  return (
    <header className={classes["main-header"]}>
      <div className={classes.logo__container}>
        <img className={classes.logo} src={logo} alt="aamusted logo" />
      </div>

      {/* {!props.isAuthenticated && (
        <div onClick={props.onToggle} className={classes.admin__button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            width={"2.5rem"}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

          {!props.toggle ? `Admin` : "User"}
        </div>
      )} */}

      <Navigation
        // onShowMenu={props.onShowMenu}
        isLoggedIn={props.isAuthenticated}
        onLogout={props.onLogout}
        onToggleMenu={props.onToggleMenu}
        toggleMenu={props.toggleMenu}
      />
    </header>
  );
};
MainHeader.propTypes = {
  isAuthenticated: PropTypes.bool,
  toggle: PropTypes.bool,
  onLogout: PropTypes.func,
  onToggleMenu: PropTypes.func,
  toggleMenu: PropTypes.bool,
  onToggle: PropTypes.bool,
};
export default MainHeader;
