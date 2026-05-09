import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Navigation.module.css";
import Menu from "./Menu";
//import PropTypes from "prop-types";
import Button from "../UI/Button/Button";
import { useAuth } from "../../context/useAuth";
import ROLES from "../../Services/ROLES";

const Navigation = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  // Toggle menu handler to toggle the visibility of the menu
  const onToggleMenuHandler = () => setToggleMenu((prevToggle) => !prevToggle);

  //Get user data and authentication status from auth context
  const { user, isLoggedIn, logout } = useAuth();

  //Logout handler to call the logout function from auth context
  const onLogoutHandler = () => {
    logout();
  };

  return (
    <Fragment>
      {isLoggedIn && (
        <div>
          <nav className={classes.nav}>
            {isLoggedIn && (
              <div>
                <Menu toggleMenu={toggleMenu} onClick={onToggleMenuHandler} />
              </div>
            )}

            {
              <>
                <div
                  onClick={onToggleMenuHandler}
                  className={toggleMenu ? `${classes.backdrop}` : ""}
                />
                <ul className={toggleMenu ? `${classes.active}` : ""}>
                  {isLoggedIn && (
                    <li>
                      <div onClick={onToggleMenuHandler}>
                        <Link
                          className={` ${classes.link} `}
                          to={
                            user.role === ROLES.ADMIN
                              ? "admin/dashboard"
                              : "/dashboard"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                            />
                          </svg>

                          <div>Dashboard</div>
                        </Link>
                      </div>
                    </li>
                  )}

                  {isLoggedIn && (
                    <li>
                      <div onClick={onToggleMenuHandler}>
                        <Link className={` ${classes.link} `} to={"/profile"}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          <div>Profile</div>
                        </Link>
                      </div>
                    </li>
                  )}

                  {isLoggedIn && user.role === ROLES.USER && (
                    <li>
                      <div onClick={onToggleMenuHandler}>
                        <Link
                          className={` ${classes.link} `}
                          to="/schoolDetails"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                            />
                          </svg>
                          <div>Add Details</div>
                        </Link>
                      </div>
                    </li>
                  )}

                  {isLoggedIn && (
                    <li>
                      <div onClick={onToggleMenuHandler}>
                        <Button
                          onClick={onLogoutHandler}
                          className={`${classes.logout}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                            />
                          </svg>
                          <div>Logout</div>
                        </Button>
                      </div>
                    </li>
                  )}
                </ul>
              </>
            }

            <p className={classes.user}>
              {user.fullName ? user.fullName.split(" ")[0] : "User"}
            </p>
          </nav>
        </div>
      )}
    </Fragment>
  );
};
// Navigation.propTypes = {
//   isLoggedIn: PropTypes.bool,
//   toggleMenu: PropTypes.bool,
//   onToggleMenu: PropTypes.func,
//   onLogout: PropTypes.func,
// };
export default Navigation;
