import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../../components/Form/SignIn.module.css";
//import Card from "../UI/Card";
import Button from "../../components/UI/Button/Button";
import axios from "axios";
import Card from "../../components/UI/Card/Card";
import { useForm } from "react-hook-form";
import "./Details.css";
import Footer from "../../components/Footer/Footer";
import app_api_url from "../../Services/app_api_url";
import { useAuth } from "../../context/useAuth";
import Skeleton from "../../components/UI/Skeleton/SkeletonPlaceholder";
import Toast from "../../components/UI/Notification/Toast";
import useInsertHook from "../../components/CustomHooks/useInsertHook";
import useUpdateHook from "../../components/CustomHooks/useUpdateHook";
import UpdateIcon from "../../components/UI/Icons/UpdateIcon";

//import HomePageNav from "./HomePageNav";

const MentorDetails = () => {
  const [loading, setLoading] = useState(true);
  const { insertData } = useInsertHook();
  const { updateData } = useUpdateHook();
  const { user } = useAuth();

  const [mentorData, setMentorData] = useState({
    studentId: "",
    title: "",
    name: "",
    contact: "",
    qualification: "",
    status: "",
    momoNumber: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: mentorData.studentId,
      title: mentorData.title,
      name: mentorData.name,
      contact: mentorData.contact,
      qualification: mentorData.qualification,
      status: mentorData.status,
      momoNumber: mentorData.momoNumber,
    },
  });

  useEffect(() => {
    const getMentorData = async () => {
      try {
        const response = await axios.get(
          `${app_api_url}/getMentorDetails/${user.userId}`,
        );

        setMentorData(response.data);
        reset(response.data);
        if (response.data) setLoading(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMentorData();
  }, [user.userId, reset]);

  const navigate = useNavigate();

  const goToSchoolDetails = () => {
    navigate("/schoolDetails");
  };

  const goToMentorDetails = () => {
    navigate("/mentorDetails");
  };

  const goToHeadDetails = () => {
    navigate("/headDetails");
  };

  ///////////////////////////////////
  //    UPDATE
  //////////////////////////////////
  const onUpdateHandler = (formData) => {
    if (!formData.studentId) {
      Toast("error", "No record to update. Click on submit to save records");
      return;
    }

    if (window.confirm("Are you sure you want to update records?")) {
      updateData(`updateMentorDetails/${formData.studentId}`, formData, Toast);
    }
  };

  //////////////////////////////////
  //    SUBMIT DATA
  /////////////////////////////////
  const onSubmitHandler = (formData) => {
    if (window.confirm("Are you sure you want to submit?")) {
      insertData(`insertMentorDetails/${user.userId}`, formData, Toast);
    }
  };

  const titleOptions = ["Mr.", "Mrs.", "Miss.", "Dr."];
  const qualificationOptions = ["Diploma", "Degree", "Masters", "PhD"];
  const statusOptions = ["Trained", "Untrained"];

  return (
    <Fragment>
      <h1 className={classes.title}>SCHOOL BASE INTERNSHIP FORM</h1>

      <nav className={classes.nav}>
        <ul>
          <li onClick={goToSchoolDetails}>School </li>
          <li className={classes.active} onClick={goToMentorDetails}>
            Mentor
          </li>
          <li onClick={goToHeadDetails}>Headteacher </li>
        </ul>
      </nav>

      <Card className={`${"form_card_container"}`}>
        <div className={classes.update__btn}></div>

        <h2 className={classes.subtitle}> MENTOR DETAILS</h2>

        {loading ? (
          <Skeleton />
        ) : (
          <form className={classes.mentor__details}>
            <div className={classes.update__btn}>
              <Button
                onClick={handleSubmit(onUpdateHandler)}
                disabled={isSubmitting}
                type="button"
              >
                <UpdateIcon />
                <span>Update</span>
              </Button>
            </div>

            <div className={"form_box_container"}>
              <div className={"form_box"}>
                <div className={classes.form_control}>
                  <label htmlFor="title">
                    Title<span className={classes.required_field}>*</span>
                  </label>
                  <select
                    className={
                      errors.title
                        ? `${classes.error} ${classes.select}`
                        : `${classes.input} `
                    }
                    id="title"
                    {...register("title", {
                      required: "Please select an option",
                    })}
                  >
                    <option value="">--Select an option-- </option>
                    {titleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.title && (
                    <small className="error">{errors.title.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="name">
                    Mentor Name<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.name
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="name"
                    placeholder="Enter your mentor name"
                    {...register("name", {
                      required: "Mentor name is required",
                    })}
                  />
                  {errors.name && (
                    <small className="error">{errors.name.message}</small>
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
                    placeholder="Enter your mentor's contact number"
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
                  <label htmlFor="qualification">
                    Qualification
                    <span className={classes.required_field}>*</span>
                  </label>
                  <select
                    className={
                      errors.qualification
                        ? `${classes.error} ${classes.select}`
                        : `${classes.input} `
                    }
                    id="qualification"
                    {...register("qualification", {
                      required: "Please select an option",
                    })}
                  >
                    <option value="">--Select an option-- </option>
                    {qualificationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <small className="error">
                      {errors.qualification.message}
                    </small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="status">
                    Status<span className={classes.required_field}>*</span>
                  </label>
                  <select
                    className={
                      errors.status
                        ? `${classes.error} ${classes.select}`
                        : `${classes.input} `
                    }
                    id="status"
                    {...register("status", {
                      required: "Please select an option",
                    })}
                  >
                    <option value="">--Select an option-- </option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <small className="error">{errors.status.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="momoNumber">
                    Mobile Money Number
                    <span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.momoNumber
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="tel"
                    id="momoNumber"
                    placeholder="Enter your mentor's mobile money number"
                    {...register("momoNumber", {
                      required: "Mobile Money Number is required",
                      maxLength: {
                        value: 10,
                        message: "Number must be 10 digits.",
                      },
                      minLength: {
                        value: 10,
                        message: "Number must be 10 digits.",
                      },
                    })}
                  />
                  {errors.momoNumber && (
                    <small className="error">{errors.momoNumber.message}</small>
                  )}
                </div>
              </div>
            </div>

            <div className={classes.btn_container}>
              <Button
                className={classes.btn}
                onClick={handleSubmit(onSubmitHandler)}
                disabled={isSubmitting}
                type="button"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Footer />
    </Fragment>
  );
};

export default MentorDetails;
