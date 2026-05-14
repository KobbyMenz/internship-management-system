//import { useState } from "react";
import { useForm } from "react-hook-form";
import classes from "./SignIn.module.css";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../UI/Notification/Toast";
import "../../pages/Details/Details.css";
import useInsertHook from "../CustomHooks/useInsertHook";
import PasswordInput from "../UI/PasswordInput/PasswordInput";

// import { useState } from "react";
// import Table from "../Table/Table";

const SignUp = () => {
  const { insertData } = useInsertHook();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  ////////////////////////////////////////////
  //      INSERT USER
  ///////////////////////////////////////////s
  const onSubmitHandler = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match!",
      });
      return;
    }

    if (!window.confirm("Are you want to sign up?")) return;
    //========Register user========
    insertData(`insertUser`, formData, Toast, () => {
      reset();
      setTimeout(() => navigate("/"), 1000); // redirect after 1s
    });
  };
  ////////////////////////////////////////////////

  const programmeOptions = [
    "BSc. Information Technology",
    "BSc. Mathematics Education",
    "BSc. Management Education",
    "BSc. Accounting Education",
    "BSc. Catering and Hospitality",
    "BSc. Social/Economics Education",
    "BSc. Fashion Education",
  ];

  return (
    <>
      {/* 🔒 LOCKOUT MODAL WITH COUNTDOWN TIMER */}

      <div className={classes.card_container}>
        <Card className={`${classes.form_container_large}`}>
          {/* <h2>SignUp</h2> */}
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="form_box_container">
              <div className={"form_box"}>
                <div className={classes.form_control}>
                  <label htmlFor="userId">
                    Index Number
                    <span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.userId
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="number"
                    id="userId"
                    placeholder="Enter your index number"
                    {...register("userId", {
                      required: "Index number is required",
                      maxLength: {
                        value: 10,
                        message: "Index number must be 10 digits.",
                      },
                      minLength: {
                        value: 10,
                        message: "Index number must be 10 digits.",
                      },
                    })}
                  />
                  {errors.userId && (
                    <small className="error">{errors.userId.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="fullNamefullName">
                    Full Name<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.fullName
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName", {
                      required: "Your Full name is required",
                    })}
                  />
                  {errors.fullName && (
                    <small className="error">{errors.fullName.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="gender">
                    Gender<span className={classes.required_field}>*</span>
                  </label>

                  <select
                    className={
                      errors.gender
                        ? `${classes.error} ${classes.select}`
                        : `${classes.input} `
                    }
                    id="gender"
                    type="text"
                    // placeholder="Select your gender"
                    {...register("gender", {
                      required: "Please select your gender",
                    })}
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <small className="error">{errors.gender.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="contact">
                    Phone<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.contact
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="tel"
                    id="contact"
                    placeholder="Enter your index number"
                    {...register("contact", {
                      required: "Contact is required",
                      maxLength: {
                        value: 10,
                        message: "Contact number must be 10 digits.",
                      },
                      minLength: {
                        value: 10,
                        message: "Contact number must be 10 digits.",
                      },
                    })}
                  />
                  {errors.contact && (
                    <small className="error">{errors.contact.message}</small>
                  )}
                </div>
              </div>

              <div className={"form_box"}>
                <div className={classes.form_control}>
                  <label htmlFor="email">
                    Email<span className={classes.required_field}>*</span>
                  </label>

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
                  <label htmlFor="programme">
                    Programme<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.programme
                        ? `${classes.error} ${classes.select}`
                        : `${classes.input} `
                    }
                    list="programmeOption"
                    id="programme"
                    type="text"
                    placeholder="Select your programme of study"
                    {...register("programme", {
                      required: "Please select an option",
                    })}
                  />
                  {errors.programme && (
                    <small className="error">{errors.programme.message}</small>
                  )}

                  <datalist id="programmeOption">
                    {programmeOptions.sort().map((optionValue, index) => (
                      <option key={index} value={optionValue} />
                    ))}
                  </datalist>
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="password">
                    Password<span className={classes.required_field}>*</span>
                  </label>

                  <PasswordInput
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
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  {errors.password && (
                    <small className="error">{errors.password.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="confirmPassword">
                    Confirm Password
                    <span className={classes.required_field}>*</span>
                  </label>

                  <PasswordInput
                    className={
                      errors.password
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "This field is required",
                      // minLength: {
                      //   value: 8,
                      //   message: "Password must be at least 8 characters long",
                      // },
                    })}
                  />
                  {errors.confirmPassword && (
                    <small className="error">
                      {errors.confirmPassword.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className={classes.btn_container}>
              <Button type="submit">Sign up</Button>
            </div>

            <p className={classes.link_container}>
              Already have an account{" "}
              <Link className={classes.link_btn} to="/">
                sign in
              </Link>
            </p>
          </form>

          {/*===== Table ======*/}
          {/* <Table data={data} /> */}
        </Card>
      </div>
    </>
  );
};
export default SignUp;
