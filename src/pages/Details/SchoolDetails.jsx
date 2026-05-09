import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../../components/Form/SignIn.module.css";
//import Card from "../UI/Card";
import Button from "../../components/UI/Button/Button";
import axios from "axios";
import { useForm } from "react-hook-form";
import Card from "../../components/UI/Card/Card";
import "./Details.css";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/useAuth";
import app_api_url from "../../Services/app_api_url";
import Skeleton from "../../components/UI/Skeleton/SkeletonPlaceholder";

//import HomePageNav from "./components/Home/HomePageNav";

const SchoolDetails = () => {
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState({
    studentId: "",
    schoolName: "",
    schoolAddress: "",
    town: "",
    region: "",
    district: "",
  });

  //console.log(schoolData);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: schoolData.studentId,
      schoolName: schoolData.schoolName,
      schoolAddress: schoolData.schoolAddress,
      town: schoolData.town,
      region: schoolData.region,
      district: schoolData.district,
    },
  });

  useEffect(() => {
    const getSchoolData = async () => {
      try {
        const response = await axios.get(
          `${app_api_url}/getSchoolDetails/${user.userId}`,
        );

        setSchoolData(response.data);
        if (response.data) setLoading(false);

        reset(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getSchoolData();
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

  //   const onShowSchoolHandler = () => {
  //     navigate("/");
  //   };

  //   const onShowMentorHandler = () => {
  //     navigate("/mentorDetails");
  //   };
  //   const onShowHeadHandler = () => {
  //     navigate("/headDetails");
  //   };

  const onUpdateHandler = (formData) => {
    console.log("Update: ", formData);
    //   axios
    //     .put(
    //       `http://localhost:3001/api/updateSchoolDetails/${formData.indexNumber}`,
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

  const onSubmitHandler = (formData) => {
    console.log("submit: ", formData);

    // const studentData = JSON.parse(localStorage.getItem("user"));

    // const formDataOnSave = {
    //   indexNumber: studentData.indexNumber,
    //   schoolName: formData.schoolName,
    //   schoolAddress: formData.schoolAddress,
    //   town: formData.town,
    //   region: formData.region,
    //   district: formData.district,
    // };

    // axios
    //   .post("http://localhost:3001/api/insertShoolDetails", formDataOnSave)
    //   .then((response) => {
    //     console.log(response.data);
    //     // alert("Registered successfully");

    //     setShowModal({
    //       title: "Message",
    //       icon: <OkayIcon />,
    //       message: "Records submitted successfully.",
    //     });
    //   })
    //   .catch((err) => {
    //     console.error("Error inserting data: ", err);
    //     // console.log(err);

    //     setShowModal({
    //       title: "Error Message",
    //       icon: <ErrorIcon />,
    //       message: `You have already submitted this form. Click on update button to update any changes`,
    //     });
    //     return;
    //   });
  };

  return (
    <Fragment>
      <h1 className={classes.title}>SCHOOL BASE INTERNSHIP FORM</h1>

      <nav className={classes.nav}>
        <ul>
          <li className={classes.active} onClick={goToSchoolDetails}>
            School
          </li>
          <li onClick={goToMentorDetails}>Mentor </li>
          <li onClick={goToHeadDetails}>Headteacher </li>
        </ul>
      </nav>

      <Card className={`${"form_card_container"}`}>
        <h2 className={classes.subtitle}> SCHOOL DETAILS</h2>

        {loading ? (
          <Skeleton />
        ) : (
          <form>
            <div className={classes.update__btn}>
              <Button
                onClick={handleSubmit(onUpdateHandler)}
                disabled={isSubmitting}
                // className={classes.btn}
                type="button"
              >
                Update
              </Button>
            </div>

            <div className={"form_box_container"}>
              <div className={"form_box"}>
                <div className={classes.form_control}>
                  <label htmlFor="schoolName">
                    School Name<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.schoolName
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="schoolName"
                    placeholder="Enter your school name"
                    {...register("schoolName", {
                      required: "School name is required",
                    })}
                  />
                  {errors.schoolName && (
                    <small className="error">{errors.schoolName.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="schoolAddress">
                    School Address
                    <span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.schoolAddress
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="schoolAddress"
                    placeholder="Enter school address"
                    {...register("schoolAddress", {
                      required: "School address is required",
                    })}
                  />
                  {errors.schoolAddress && (
                    <small className="error">
                      {errors.schoolAddress.message}
                    </small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="town">
                    Town<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.town
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="town"
                    placeholder="Enter the town in which the school is located"
                    {...register("town", {
                      required: "Town is required",
                    })}
                  />
                  {errors.town && (
                    <small className="error">{errors.town.message}</small>
                  )}
                </div>
              </div>

              <div className={"form_box"}>
                <div className={classes.form_control}>
                  <label htmlFor="region">
                    Region<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.region
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="region"
                    placeholder="Enter the region in which the school is located"
                    {...register("region", {
                      required: "Region is required",
                    })}
                  />
                  {errors.region && (
                    <small className="error">{errors.region.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="district">
                    District<span className={classes.required_field}>*</span>
                  </label>

                  <input
                    className={
                      errors.district
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="text"
                    id="district"
                    placeholder="Enter the district in which the school is located"
                    {...register("district", {
                      required: "District is required",
                    })}
                  />
                  {errors.district && (
                    <small className="error">{errors.district.message}</small>
                  )}
                </div>
              </div>
            </div>

            <div className={classes.btn_container}>
              <Button
                onClick={handleSubmit(onSubmitHandler)}
                disabled={isSubmitting}
                className={classes.btn}
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

export default SchoolDetails;
