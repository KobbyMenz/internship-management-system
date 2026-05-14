import { useState, Fragment, useEffect, useCallback } from "react";
import classes from "../../components/Form/SignIn.module.css";
import Button from "../../components/UI/Button/Button";
import Card from "../../components/UI/Card/Card";
import "./Details.css";
import { useForm } from "react-hook-form";
import Footer from "../../components/Footer/Footer";
import Skeleton from "../../components/UI/Skeleton/SkeletonPlaceholder";
import UpdateIcon from "../../components/UI/Icons/UpdateIcon";
import useInsertHook from "../../components/CustomHooks/useInsertHook";
import useUpdateHook from "../../components/CustomHooks/useUpdateHook";
import { useAuth } from "../../context/useAuth";
import Toast from "../../components/UI/Notification/Toast";
import app_api_url from "../../Services/app_api_url";
import axios from "axios";

//import HomePageNav from "./HomePageNav";

const HeadDetails = () => {
  const [loading, setLoading] = useState(true);
  const { insertData } = useInsertHook();
  const { updateData } = useUpdateHook();
  const { user } = useAuth();

  const routeName = "head";

  const [instructData, setInstructorData] = useState({
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
      studentId: instructData.studentId,
      title: instructData.title,
      name: instructData.name,
      contact: instructData.contact,
      qualification: instructData.qualification,
      status: instructData.status,
      momoNumber: instructData.momoNumber,
    },
  });

  const getInstructorData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${app_api_url}/getInstructor/${user.userId}/${routeName}`,
      );

      setInstructorData(response.data);
      reset(response.data);
      if (response.data) setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.userId, reset]);

  useEffect(() => {
    getInstructorData();
  }, [getInstructorData]);

  const onUpdateHandler = (formData) => {
    if (!formData.studentId) {
      Toast("error", "No record to update. Click on submit to save records");
      return;
    }

    if (window.confirm("Are you sure you want to update records?")) {
      updateData(
        `updateInstructor/${formData.studentId}/${routeName}`,
        formData,
        Toast,
      );
    }

    //   if (+formData.contact.length !== 10 || +formData.momoNumber.length !== 10) {
    //     setShowModal({
    //       title: "Error Message",
    //       icon: <ErrorIcon />,
    //       message: "Contact and momo number input must be a 10 digit number",
    //     });

    //     return;
    //   }

    //   axios
    //     .put(
    //       `http://localhost:3001/api/updateHeadDetails/${formData.indexNumber}`,
    //       formData,
    //     )
    //     .then((response) => {
    //       console.log(response.data);
    //       // alert("Registered successfully");

    //       setShowModal({
    //         title: "Message",
    //         icon: <OkayIcon />,
    //         message: "Records updated successfully.",
    //       });
    //     })
    //     .catch((err) => {
    //       console.error("Error updating records: ", err);
    //       // console.log(err);

    //       setShowModal({
    //         title: "Error Message",
    //         icon: <ErrorIcon />,
    //         message: `Error updating records. You have no records to update in the database`,
    //       });
    //     });
  };

  // const closeModalHandler = () => {
  //   setShowModal(null);
  // };

  const onSubmitHandler = (formData) => {
    if (window.confirm("Are you sure you want to submit?")) {
      insertData(
        `insertInstructor/${user.userId}/${routeName}`,
        formData,
        Toast,
        () => getInstructorData(), // 👈 refetch after successful update
      );
    }

    // const studentData = JSON.parse(localStorage.getItem("user"));

    // const formDataOnSave = {
    //   indexNumber: studentData.indexNumber,
    //   title: formData.title,
    //   name: formData.name,
    //   contact: formData.contact,
    //   qualification: formData.qualification,
    //   status: formData.status,
    //   momoNumber: formData.momoNumber,
    // };

    // // if (
    // //   formDataOnSave.contact !== +formDataOnSave.contact ||
    // //   formDataOnSave.momoNumber !== +formDataOnSave.momoNumber
    // // ) {
    // //   setShowModal({
    // //     title: "Error Message",
    // //     message: "Input must be a phone number",
    // //   });

    // //   return;
    // // }

    // if (
    //   +formDataOnSave.contact.length !== 10 ||
    //   +formDataOnSave.momoNumber.length !== 10
    // ) {
    //   setShowModal({
    //     title: "Error Message",
    //     icon: <ErrorIcon />,
    //     message: "Contact and momo number input must be a 10 digit number",
    //   });

    //   return;
    // }

    // axios
    //   .post("http://localhost:3001/api/insertHeadDetails", formDataOnSave)
    //   .then((response) => {
    //     console.log(response.data);
    //     // alert("Registered successfully");

    //     // setShowModal({
    //     //   title: "Message",
    //     //   icon: <ErrorIcon />,
    //     //   message: "Records submitted successfully.",
    //     // });
    //   })
    //   .catch((err) => {
    //     console.error("Error inserting data: ", err);
    //     console.log(err);

    //     // setShowModal({
    //     //   title: "Error Message",
    //     //   icon: <ErrorIcon />,
    //     //   message: `You have already submited this form. Click on update button to update any changes`,
    //     // });
    //     // return;
    //   });
  };

  const titleOptions = ["Mr.", "Mrs.", "Miss.", "Dr."];
  const qualificationOptions = ["Diploma", "Degree", "Masters", "PhD"];
  const statusOptions = ["Trained", "Untrained"];

  return (
    <Fragment>
      <Card className={`${"form_card_container"}`}>
        <h2 className={classes.subtitle}> HEAD TEACHER DETAILS</h2>

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
                    placeholder="Enter your headteacher's name"
                    {...register("name", {
                      required: "Headteacher name is required",
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
                    placeholder="Enter your headteacher's contact number"
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
                    placeholder="Enter your headteacher's mobile money number"
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

export default HeadDetails;
