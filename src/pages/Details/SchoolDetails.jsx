import { useState, Fragment, useEffect } from "react";
import classes from "../../components/Form/SignIn.module.css";
import Button from "../../components/UI/Button/Button";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import Card from "../../components/UI/Card/Card";
import "./Details.css";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/useAuth";
import app_api_url from "../../Services/app_api_url";
import Skeleton from "../../components/UI/Skeleton/SkeletonPlaceholder";
import useInsertHook from "../../components/CustomHooks/useInsertHook";
import useUpdateHook from "../../components/CustomHooks/useUpdateHook";
import Toast from "../../components/UI/Notification/Toast";
import UpdateIcon from "../../components/UI/Icons/UpdateIcon";
import { ghanaRegions } from "../../Services/ghanaRegions";

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

  const { insertData } = useInsertHook();
  const { updateData } = useUpdateHook();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
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

  // Watch the selected region to dynamically update district options
  const selectedRegion = useWatch({ control, name: "region" });

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
      } finally {
        setLoading(false);
      }
    };

    getSchoolData();
  }, [user.userId, reset]);

  ///////////////////////////////////
  //    UPDATE
  //////////////////////////////////
  const onUpdateHandler = (formData) => {
    if (!formData.studentId) {
      Toast("error", "No record to update. Click on submit to save records");
      return;
    }

    if (window.confirm("Are you sure you want to update records?")) {
      updateData(`updateSchoolDetails/${formData.studentId}`, formData, Toast);
    }
  };

  //////////////////////////////////
  //    SUBMIT DATA
  /////////////////////////////////
  const onSubmitHandler = (formData) => {
    if (window.confirm("Are you sure you want to submit?")) {
      insertData(`insertShoolDetails/${user.userId}`, formData, Toast);
    }
  };

  return (
    <Fragment>
      {/* <h1 className={classes.title}>SCHOOL BASE INTERNSHIP FORM</h1>

      <nav className={classes.nav}>
        <ul>
          <li className={classes.active} onClick={goToSchoolDetails}>
            School
          </li>
          <li onClick={goToMentorDetails}>Mentor </li>
          <li onClick={goToHeadDetails}>Headteacher </li>
        </ul>
      </nav> */}

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
                <UpdateIcon />
                <span>Update</span>
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

                  <select
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
                  >
                    <option id={classes.empty_value} value="">Select a region</option>
                    {ghanaRegions.map((region) => (
                      <option key={region.region} value={region.region}>
                        {region.region}
                      </option>
                    ))}
                  </select>

                  {errors.region && (
                    <small className="error">{errors.region.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="district">
                    District<span className={classes.required_field}>*</span>
                  </label>

                  <select
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
                  >
                    <option value="">Select a district</option>
                    {ghanaRegions
                      .find((region) => region.region === selectedRegion)
                      ?.districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
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
