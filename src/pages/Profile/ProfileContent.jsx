import { Fragment, useCallback, useEffect, useState } from "react";
import "./ProfileContent.css";
import classes from "../../components/Form/SignIn.module.css";
import Card from "../../components/UI/Card/Card";
import Button from "../../components/UI/Button/Button";
//import defaultProfilePicture from "../../../../src/assets/images/profilePicture.png";
import PropTypes from "prop-types";
//import ErrorIcon from "../../components/UI/Icons/ErrorIcon";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/UI/Notification/Toast";
import ProfileSkeleton from "../../components/UI/Skeleton/ProfileSkeleton";
//import UploadIcon from "../../components/UI/Icons/UploadIcon";
//import DeleteIcon from "../../components/UI/Icons/DeleteIcon";
import SaveIcon from "../../components/UI/Icons/SaveIcon";
import ImageBox from "../../components/UI/ImageBox/ImageBox";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/useAuth";
import ROLES from "../../Services/ROLES";
import useUpdateHook from "../../components/CustomHooks/useUpdateHook";
import app_api_url from "../../Services/app_api_url";
import axios from "axios";
import nameInitials from "../../Functions/nameInitials";
import StudentIcon from "../../components/UI/Icons/StudentIcon";
import UserIcon from "../../components/UI/Icons/UserIcon";
import AdminIcon from "../../components/UI/Icons/AdminIcon";
import TelephoneIcon from "../../components/UI/Icons/TelephoneIcon";
//import PasswordInput from "../../UI/PasswordInput/PasswordInput";

const ProfileContent = () => {
  const [loading, setLoading] = useState(true);
  const { updateData } = useUpdateHook();
  // const [gender, setGender] = useState("");
  // const [name, setName] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    contact: "",
    gender: "",
  });

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
    resetField,
    setError,
    reset,
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

  // const getUserData = useCallback(async () => {
  //   if (!user?.userId || !user?.role) return; // ✅ guard against missing user
  //   try {
  //     const response = await axios.get(
  //       `${app_api_url}/getUser/${user.userId}/${user.role}`,
  //     );

  //     if (response.data) {
  //       reset(response.data);
  //       setName(response.data.fullName);
  //       setGender(response.data.gender);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false); // ✅ only here
  //   }
  // }, [user, reset]);

  // useEffect(() => {
  //   getUserData();
  // }, [getUserData]);

  const getUserData = useCallback(async () => {
    if (!user?.userId || !user?.role) return;
    try {
      const response = await axios.get(
        `${app_api_url}/getUser/${user.userId}/${user.role}`,
      );
      if (response.data) {
        reset(response.data);
        // setName(response.data.fullName);
        // setGender(response.data.gender);
        setUserData((prev) => ({
          ...prev,
          fullName: response.data.fullName,
          contact: response.data.contact,
          gender: response.data.gender,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, reset]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

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
  // Updating User
  /////////////////////////////
  const submitFormHandler = useCallback(
    (formData) => {
      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match!",
        });
        return;
      }

      if (window.confirm("Are you sure you want to save changes?")) {
        updateData(
          `updateUser/${+user.userId}/${user.role}`,
          formData,
          Toast,
          () => {
            getUserData(); // 👈 refetch after successful update
            resetField("password");
            resetField("confirmPassword");
          },
        );
      }
    },
    [updateData, user.userId, user.role, setError, resetField, getUserData], // 👈 add getUserData
  );

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
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <form onSubmit={handleSubmit(submitFormHandler)}>
              <div className="profile_container">
                <div className="profile_form">
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
                      })}
                      readOnly
                    />
                    {errors.userId && (
                      <small className="error">{errors.userId.message}</small>
                    )}
                  </div>

                  <div className={classes.form_control}>
                    <label htmlFor="fullName">
                      Full Name<span className={classes.required_field}>*</span>
                    </label>

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
                      // readOnly
                    />
                    {errors.fullName && (
                      <small className="error">{errors.fullName.message}</small>
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
                      placeholder="Enter your phone number"
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
                      readOnly
                    />
                    {errors.email && (
                      <small className="error">{errors.email.message}</small>
                    )}
                  </div>

                  {user.role === ROLES.USER && (
                    <div className={classes.form_control}>
                      <label htmlFor="programme">
                        Programme
                        <span className={classes.required_field}>*</span>
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
                        <small className="error">
                          {errors.programme.message}
                        </small>
                      )}

                      <datalist id="programmeOption">
                        {programmeOptions.sort().map((optionValue, index) => (
                          <option key={index} value={optionValue} />
                        ))}
                      </datalist>
                    </div>
                  )}
                </div>

                <div className="profile_picture_container">
                  <div className="profile_picture">
                    {/* <Avatar
                      alt="avatar"
                      src={selectedImage}
                      sx={avatarSx}
                    /> */}

                    <Card className="profile_card_container">
                      <div className="image">
                        <ImageBox
                          borderRadius={"50%"}
                          width="10rem"
                          height="10rem"
                          border="0.1rem solid #999999"
                          background={"#ccc"}
                        />
                      </div>

                      <div className="profile_name_box">
                        <h1 className="name_initials">
                          {userData.fullName
                            ? nameInitials(userData.fullName)
                            : ""}
                        </h1>
                        <h2 className="user_name">{userData.fullName}</h2>

                        <div className="details_box_container">
                          <div>
                            <div className="details_box">
                              {user.role === ROLES.ADMIN ? (
                                <AdminIcon />
                              ) : (
                                <StudentIcon />
                              )}

                              <p>
                                {user.role === ROLES.ADMIN
                                  ? "Admin"
                                  : "Student"}
                              </p>
                            </div>

                            <div className="details_box">
                              <TelephoneIcon />

                              <p>{userData.contact}</p>
                            </div>

                            {user.role === ROLES.USER && (
                              <div className="details_box">
                                <UserIcon />

                                <p> {userData.gender}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

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
                    placeholder="Enter your new password"
                    {...register("password", {
                      // required: "Password is required",
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
                  <label htmlFor="confirmPassword">Confirm Password</label>

                  <input
                    className={
                      errors.confirmPassword
                        ? `${classes.error} ${classes.input}`
                        : `${classes.input} `
                    }
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    {...register("confirmPassword", {
                      // required: "Password is required",
                    })}
                  />
                  {errors.confirmPassword && (
                    <small className="error">
                      {errors.confirmPassword.message}
                    </small>
                  )}
                </div>

                <Button type="submit" className="btn">
                  <SaveIcon />

                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          )}
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
