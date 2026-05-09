//import { useState } from "react";
import { useForm } from "react-hook-form";
import classes from "./SignIn.module.css";
import { useAuth } from "../../context/useAuth";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import { Link } from "react-router-dom";
import LockoutModal from "../UI/Modal/LockoutModal";
import LoginIcon from "../UI/Icons/LoginIcon";
import LoginLoader from "../UI/Loader/LoginLoader";
import { useState } from "react";
import ROLES from "../../Services/ROLES";
import Switch from "../UI/Switch/Switch";
// import { useState } from "react";
// import Table from "../Table/Table";

const SignIn = () => {
  const [switchMode, setSwitchMode] = useState(false);
  //const [mode, setMode] = useState(ROLES.USER);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mode: ROLES.USER,
    },
  });

  //console.log("mode: ", mode);

  const { login, showLockoutModal, setShowLockoutModal, loadingLogin } =
    useAuth();

  const switchModeHandler = () => {
    const newMode = switchMode ? ROLES.USER : ROLES.ADMIN; // calculate new mode
    setSwitchMode((prev) => !prev);
    // setMode(newMode);
    reset({ mode: newMode }); // ✅ reset form with new mode value
  };

  const onSubmitHandler = (formData) => {
    // const loginData = {
    //   email: data.email,
    //   password: data.password,
    // };

    //console.log(formData);

    login(formData);

    ///setData((prevData) => [...prevData, formData]);

    // reset();
  };
  return (
    <>
      {showLockoutModal && (
        <LockoutModal
          title="🔒 Account Locked"
          message="Too many failed login attempts."
          // timeRemaining={timeRemaining}
          onCloseModal={() => setShowLockoutModal(false)}
        />
      )}
      <Card className={`${classes.form_container}`}>
        <h2 className={classes.subtitle}>
          {switchMode ? `ADMIN LOGIN` : `STUDENT LOGIN`}
        </h2>

        {/* <Button onClick={switchModeHandler}>Switch</Button> */}
        <div className={classes.switch}>
          <Switch onSwitch={switchModeHandler} switchMode={switchMode} />
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={classes.form_control}>
            <label htmlFor="username">Username</label>

            <input
              className={
                errors.username
                  ? `${classes.error} ${classes.input}`
                  : `${classes.input} `
              }
              type="text"
              id="username"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <small className="error">{errors.username.message}</small>
            )}
          </div>

          <div className={classes.form_control}>
            <label htmlFor="password">Password</label>
            <input
              className={
                errors.password
                  ? `${classes.error} ${classes.input}`
                  : `${classes.input} `
              }
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                // minLength: {
                //   value: 8,
                //   message: "Password must be at least 8 characters long",
                // },
              })}
            />
            {errors.password && (
              <small className="error">{errors.password.message}</small>
            )}
          </div>

          <div className={classes.btn_container}>
            <Button type="submit">
              {" "}
              {<LoginIcon />} {loadingLogin ? <LoginLoader /> : `Login`}
            </Button>
          </div>

          <p className={classes.link_container}>
            Don't have an account{" "}
            <Link className={classes.link_btn} to="/signup">
              signup
            </Link>
          </p>
        </form>
      </Card>
    </>
  );
};
export default SignIn;
