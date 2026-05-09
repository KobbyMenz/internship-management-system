import { Fragment, useCallback } from "react";
import "./ProfileContent.css";
import classes from "../../components/Form/SignIn.module.css";
import Card from "../../components/UI/Card/Card";
import Button from "../../components/UI/Button/Button";
//import defaultProfilePicture from "../../../../src/assets/images/profilePicture.png";
import PropTypes from "prop-types";
import axios from "axios";
//import ErrorIcon from "../../components/UI/Icons/ErrorIcon";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/UI/Notification/Toast";
//import ProfileSkeleton from "../../UI/Skeleton/ProfileSkeleton";
//import UploadIcon from "../../components/UI/Icons/UploadIcon";
//import DeleteIcon from "../../components/UI/Icons/DeleteIcon";
import SaveIcon from "../../components/UI/Icons/SaveIcon";
import ImageBox from "../../components/UI/ImageBox/ImageBox";
import app_api_url from "../../Services/app_api_url";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/useAuth";
//import PasswordInput from "../../UI/PasswordInput/PasswordInput";

const ProfileContent = () => {
  //const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [file, setFile] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const fileInput = useRef(null);
  // const { onSubmitProfilePicture } = props;
  // const [formData, setFormData] = useState({
  //   id: "",
  //   userName: "",
  //   name: "",
  //   email: "",
  //   phone: "",
  //   password: "",
  //   confirmPassword: "",
  // });
  //const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const fullName = user ? user.fullName : "";

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: user.userId,
      fullName: fullName,
      contact: user.contact,
      email: user.email,
      programme: user.programme,
    },
  });

  //function to change profile image
  // const profilePictureChangeHandler = useCallback((e) => {
  //   const file = e.target.files[0];
  //   setFile(file);
  // }, []);

  //========Getting and setting user's info from local storage to input fields============
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (!storedUser) {
  //     setLoading(false);
  //     return;
  //   }

  //   const userDataFromLocalStorage = JSON.parse(storedUser);
  //   const userId = userDataFromLocalStorage?.userId;

  //   const getUserData = async () => {
  //     try {
  //       const response = await axios.get(`${app_api_url}/getUser/${+userId}`);

  //       if (response.data) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           id: response.data.userId,
  //           userName: response.data.userName,
  //           name: response.data.fullName,
  //           email: response.data.email,
  //           phone: response.data.phoneNumber,
  //         }));
  //       }
  //     } catch (err) {
  //       if (err.response && err.response.data && err.response.data.error) {
  //         Toast("error", err.response.data.error);

  //         setShowModal({
  //           title: "Error Message",
  //           icon: <ErrorIcon />,
  //           message: err.response.data.error,
  //         });
  //       } else {
  //         Toast("error", "Server can not be reached");
  //       }
  //     }
  //   };
  //   getUserData();
  // }, []);

  //=======fetching profile picture from the backend========
  // const fetchProfilePictureCallBack = useCallback(() => {
  //   //Fetching profile picture from the backend
  //   const fetchProfilePicture = async () => {
  //     const userId = formData.id;

  //     if (userId === "" || userId === null) return;

  //     try {
  //       const response = await axios.get(
  //         `${app_api_url}/getUserProfilePicture/${userId}`,
  //       );
  //       const pic = response?.data?.profilePicture;
  //       if (pic) {
  //         setSelectedImage(pic);
  //         onSubmitProfilePicture(pic);
  //       }
  //       //  else {
  //       //   setSelectedImage(defaultProfilePicture);
  //       //   onSubmitProfilePicture(defaultProfilePicture);
  //       // }
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err.message || err);
  //       setLoading(false);
  //     }
  //   };
  //   fetchProfilePicture();
  // }, [formData.id, onSubmitProfilePicture]);

  // useEffect(() => {
  //   //Fetching profile picture from the backend
  //   fetchProfilePictureCallBack();
  // }, [fetchProfilePictureCallBack]);

  //////////////////////////////////////
  // DELETE PROFILE PHOTO
  /////////////////////////////////////
  // const deleteProfileHandler = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     if (window.confirm("Are you sure you want to delete")) {
  //       const profileFormData = new FormData();
  //       profileFormData.append("userId", formData.id);
  //       profileFormData.append("profilePicture", file);

  //       try {
  //         //Deleting profile picture from the backend
  //         const response = await axios.put(
  //           `${app_api_url}/deleteProfile`,
  //           profileFormData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           },
  //         );

  //         //Checking for successful update and clear image path
  //         if (response.data.message) {
  //           Toast("success", `${response.data.message}`); //successful upload

  //           setSelectedImage(null);
  //           onSubmitProfilePicture(null);

  //           setFile(null);
  //           fileInput.current.value = null;
  //         }
  //       } catch (err) {
  //         Toast("error", `Error deleting profile photo ${err}`);
  //       }
  //     }
  //   },
  //   [formData.id, file, onSubmitProfilePicture],
  // );

  //////////////////////////////////////////////////////////
  //UPLOAD PROFILE PHOTO
  //////////////////////////////////////////////////////////
  // const submitProfilePictureHandler = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     if (!file) {
  //       Toast("error", "No image was selected");

  //       return;
  //     }

  //     //Creating FormData to send the profile picture
  //     const profileFormData = new FormData();
  //     profileFormData.append("profilePicture", file); //key must match what multer expects
  //     profileFormData.append("userId", formData.id);

  //     if (window.confirm("Are you sure you want to upload new photo?")) {
  //       // const uploadProfilePicture = async () => {
  //       try {
  //         const response = await axios.post(
  //           `${app_api_url}/uploadProfilePicture`,
  //           profileFormData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           },
  //         );
  //         //After successful upload, fetch the updated profile picture
  //         fetchProfilePictureCallBack();

  //         //Checking for successful update and clear image path
  //         if (response.data.message) {
  //           Toast("success", `${response.data.message}`); //successful upload

  //           setFile(null);
  //           fileInput.current.value = null;
  //         }
  //       } catch (err) {
  //         if (err.response && err.response.data && err.response.data.error) {
  //           Toast("error", `${err.response.data.error}`);
  //         } else {
  //           Toast("error", `Error uploading profile picture ${err}`);
  //         }
  //       }
  //     }
  //   },
  //   [fetchProfilePictureCallBack, file, formData.id],
  // );

  //////////////////////////////
  // Updating password
  /////////////////////////////
  const submitFormaHandler = useCallback(async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      Toast("error", "Password mismatched!");
      return;
    }

    console.log(formData);

    //confirmation to update
    if (window.confirm("Are you sure you want to save changes?")) {
      const userId = formData.userId;
      try {
        const response = await axios.put(
          `${app_api_url}/updateUserProfile/${+userId}`,
          {
            userName: formData.userName,
            password: formData.password,
          },
        );

        Toast("success", `${response.data.message}`);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          Toast("error", `${err.response.data.error}`);
        } else {
          Toast("error", `Error updating records ${err}`);
        }
      }
    }
  }, []);

  ////////////////////////////////
  // const closeShowModalHandler = useCallback(() => {
  //   setShowModal((prev) => !prev);
  // }, []);

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {/* {showModal && (
        <Modal
          title={showModal.title}
          icon={showModal.icon}
          message={showModal.message}
          onCloseModal={closeShowModalHandler}
        />
      )} */}

      <div className={"content__container"}>
        <Card className={"card__wrapper"}>
          {
            // loading ? (
            //   <ProfileSkeleton />
            // ) :
            <form onSubmit={handleSubmit(submitFormaHandler)}>
              <div className="profile_container">
                <div className="profile_form">
                  <div className={classes.form_control}>
                    <label htmlFor="userId">Index Number</label>

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
                      })}
                      readOnly
                    />
                    {errors.userId && (
                      <small className="error">{errors.userId.message}</small>
                    )}
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="fullName">Full Name</label>

                    <input
                      className={
                        errors.userId
                          ? `${classes.error} ${classes.input}`
                          : `${classes.input} `
                      }
                      type="text"
                      id="fullName"
                      placeholder="Enter your index number"
                      {...register("fullName", {
                        required: "Name is required",
                      })}
                      readOnly
                    />
                    {errors.fullName && (
                      <small className="error">{errors.fullName.message}</small>
                    )}
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="contact">Phone</label>

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
                      readOnly
                    />
                    {errors.email && (
                      <small className="error">{errors.email.message}</small>
                    )}
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="programme">Programme</label>

                    <input
                      className={
                        errors.programme
                          ? `${classes.error} ${classes.input}`
                          : `${classes.input} `
                      }
                      type="text"
                      id="programme"
                      placeholder="Enter your email"
                      {...register("programme", {
                        required: "Email is required",
                      })}
                      readOnly
                    />
                    {errors.programme && (
                      <small className="error">
                        {errors.programme.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="profile_picture_container">
                  <div className="profile_picture">
                    {/* <Avatar
                      alt="avatar"
                      src={selectedImage}
                      sx={avatarSx}
                    /> */}

                    <ImageBox width="13rem" height="16rem" />

                    {/* <div className="image_chooser_container">
                      <div className="form_control">
                        <label htmlFor="photo">Choose photo:</label>
                        <input
                          id="photo"
                          ref={fileInput}
                          type="file"
                          onChange={profilePictureChangeHandler}
                          name="profilePicture"
                          accept="image/*"
                        />
                      </div>

                      <div className="btns">
                        <Button
                          // onClick={submitProfilePictureHandler}
                          className="btn"
                        >
                          <UploadIcon />
                          Upload
                        </Button>

                        <Button
                          // onClick={deleteProfileHandler}
                          className="btn delete_btn"
                        >
                          <DeleteIcon />
                          Delete
                        </Button>
                      </div>
                    </div> */}
                    {/* </form> */}
                  </div>
                </div>
              </div>

              <p className="password_header">
                Leave Password field blank if you do not want to change.
              </p>

              <div className="profile_form password_form">
                <div className={classes.form_control}>
                  <label htmlFor="password">New Password</label>

                  <input
                    className={
                      errors.password
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="password"
                    id="password"
                    placeholder="Enter your email"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <small className="error">{errors.password.message}</small>
                  )}
                </div>

                <div className={classes.form_control}>
                  <label htmlFor="confirmPassword">Confirm Password</label>

                  <input
                    className={
                      errors.confirmPassword
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="password"
                    id="confirmPassword"
                    placeholder="Enter your email"
                    {...register("confirmPassword", {
                      required: "Password is required",
                    })}
                  />
                  {errors.confirmPassword && (
                    <small className="error">
                      {errors.confirmPassword.message}
                    </small>
                  )}
                </div>

                <Button type="submit" className="btn">
                  <div className="btn_icon">
                    <SaveIcon />
                  </div>
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          }
        </Card>

        <Footer />
      </div>
    </Fragment>
  );
};
ProfileContent.propTypes = {
  onSubmitProfilePicture: PropTypes.func,
  userDetails: PropTypes.object,
};
export default ProfileContent;
