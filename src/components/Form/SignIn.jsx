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
// import { useState } from "react";
// import Table from "../Table/Table";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm();

  const { login, showLockoutModal, setShowLockoutModal, loadingLogin } =
    useAuth();

  const onSubmitHandler = (formData) => {
    // const loginData = {
    //   email: data.email,
    //   password: data.password,
    // };

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
      {
        <Card className={`${classes.form_container}`}>
          {/* <h2>SignIn</h2> */}
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={classes.form_control}>
              <label htmlFor="email">Email</label>

              <input
                className={
                  errors.email
                    ? `${classes.error} ${classes.input}`
                    : `${classes.input} `
                }
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <small className="error">{errors.email.message}</small>
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

          {/*===== Table ======*/}
          {/* <Table data={data} /> */}
        </Card>
      }
    </>
  );
};
export default SignIn;
