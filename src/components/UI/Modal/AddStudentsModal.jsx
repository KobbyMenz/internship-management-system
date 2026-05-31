import { Fragment, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Card from "../Card/Card";
import CloseIcon from "../Icons/CloseIcon";
import "../Modal/Modal.css";
import { useForm } from "react-hook-form";
import classes from "../../Form/SignIn.module.css";
import useInsertHook from "../../CustomHooks/useInsertHook";
import Toast from "../../UI/Notification/Toast";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
//import app_api_url from "../../../Services/app_api_url";
import Button from "../Button/Button";
import programmeOptions from "../../../Services/programmeOptions";
import DotLoader from "../Icons/DotLoader";

const Backdrop = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose} />
);

const ModalOverlay = ({ onClose, children }) => (
  <Card
    className="modal-card"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <header className="header">
      <h3 className="modal-title">Add New User</h3>

      <button
        type="button"
        className="close_btn"
        onClick={onClose}
        // aria-label="Close dialog"
      >
        <CloseIcon />
      </button>
    </header>

    <div className="content">{children}</div>
  </Card>
);

const AddStudentsModal = ({
  onCloseModal,
  // title = "Add New User",
  toastModal,
  refreshTable,
}) => {
  const { insertData } = useInsertHook();
  const {
    register,
    handleSubmit,
    setError,
    //setValue,
    reset,
    formState: { errors },
  } = useForm();

  //const [photoPreview, setPhotoPreview] = useState(null);
  const firstFieldRef = useRef(null);
  //const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = toastModal || Toast;
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const modalRef = useRef(null);
  // const notify = useCallback((type, msg) => toast(type, msg), [toast]);

  //   const handleFileChange = async (e) => {
  //     const file = e.target.files && e.target.files[0];
  //     if (!file) return;

  //     setPhotoPreview(URL.createObjectURL(file));
  //     setUploadingPhoto(true);

  //     try {
  //       const fd = new FormData();
  //       fd.append("photo", file);

  //       const res = await fetch(`${app_api_url}/uploadPhoto`, {
  //         method: "POST",
  //         body: fd,
  //       });
  //       const data = await res.json();
  //       if (!res.ok) {
  //         notify("error", data.error || "Photo upload failed");
  //         setUploadingPhoto(false);
  //         return;
  //       }

  //       setValue("photo", data.url);
  //       notify("success", "Photo uploaded");
  //     } catch (err) {
  //       console.error(err);
  //       notify("error", "Photo upload failed");
  //     } finally {
  //       setUploadingPhoto(false);
  //     }
  //   };

  const onSubmitHandler = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match!",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to register this student?"))
      return;

    setLoading(true);
    setGeneralError("");
    (async () => {
      const res = await insertData(
        "insertUser",
        formData,
        toast,
        () => {
          // onSuccess handled below
        },
        refreshTable,
      );

      if (res && res.success) {
        setSuccessMessage(res.data?.message || "Registered successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        reset();
        onCloseModal();
      } else {
        setGeneralError(res?.error || "Failed to register");
      }

      setLoading(false);
    })();
  };

  // focus first input and bind Escape key to close modal
  useEffect(() => {
    try {
      firstFieldRef.current?.focus();
    } catch (e) {
      console.log(e);
    }
    const onKey = (ev) => {
      if (ev.key === "Escape") onCloseModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCloseModal]);

  // focus trap
  useEffect(() => {
    const trap = (e) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={onCloseModal} />,
        document.getElementById("backdrop-root"),
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={onCloseModal}>
          <form
            className={classes.form_box_container}
            onSubmit={handleSubmit(onSubmitHandler)}
            ref={modalRef}
          >
            {generalError && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: "#ca0202",
                  background: "#ca02024f",
                  marginBottom: "0.6rem",
                  padding: "0.6rem",
                  textAlign: "center",
                }}
              >
                {generalError}
              </div>
            )}
            {successMessage && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: "#ffffff",
                  background: "#2e8b57",
                  padding: "0.6rem",
                  borderRadius: "0.6rem",
                  marginBottom: "0.6rem",
                  textAlign: "center",
                }}
              >
                {successMessage}
              </div>
            )}
            <div className={classes.form_box}>
              <div className={classes.form_control}>
                <label>
                  Index Number<span className="required_field">*</span>
                </label>
                <input
                  ref={firstFieldRef}
                  className={
                    errors.userId
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Enter index number"
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
                  <div className={classes.form_error}>
                    {errors.userId.message}
                  </div>
                )}
              </div>

              <div className={classes.form_control}>
                <label>
                  Full Name<span className="required_field">*</span>
                </label>
                <input
                  className={
                    errors.fullName
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Enter full name"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
                {errors.fullName && (
                  <div className={classes.form_error}>
                    {errors.fullName.message}
                  </div>
                )}
              </div>

              <div className={classes.form_control}>
                <label>
                  Gender<span className="required_field">*</span>
                </label>
                <select
                  className={
                    errors.gender
                      ? `${classes.error} ${classes.select}`
                      : `${classes.select} `
                  }
                  {...register("gender", {
                    required: "Please select a gender",
                  })}
                >
                  <option value="">Select a gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {/* <option value="Other">Other</option> */}
                </select>
                {errors.gender && (
                  <div className={classes.form_error}>
                    {errors.gender.message}
                  </div>
                )}
              </div>

              <div className={classes.form_control}>
                <label>
                  Phone<span className="required_field">*</span>
                </label>
                <input
                  className={
                    errors.contact
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Enter phone number"
                  {...register("contact", {
                    required: "Phone number is required",
                    maxLength: {
                      value: 10,
                      message: "Phone number must be 10 digits.",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be 10 digits.",
                    },
                  })}
                />
                {errors.contact && (
                  <div className={classes.form_error}>
                    {errors.contact.message}
                  </div>
                )}
              </div>
            </div>

            <div className={classes.form_box}>
              <div className={classes.form_control}>
                <label>
                  Email<span className="required_field">*</span>
                </label>
                <input
                  className={
                    errors.email
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <div className={classes.form_error}>
                    {errors.email.message}
                  </div>
                )}
              </div>

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
                  <small className="error">{errors.programme.message}</small>
                )}

                <datalist id="programmeOption">
                  {programmeOptions.sort().map((optionValue, index) => (
                    <option key={index} value={optionValue} />
                  ))}
                </datalist>
              </div>

              <div className={classes.form_control}>
                <label>
                  Password<span className="required_field">*</span>
                </label>
                <PasswordInput
                  className={
                    errors.password
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                />
                {errors.password && (
                  <div className={classes.form_error}>
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className={classes.form_control}>
                <label>
                  Confirm Password<span className="required_field">*</span>
                </label>
                <PasswordInput
                  className={
                    errors.confirmPassword
                      ? `${classes.error} ${classes.input}`
                      : `${classes.input} `
                  }
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                  })}
                />
                {errors.confirmPassword && (
                  <div className={classes.form_error}>
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              {/* <div className={classes.form_control}>
                <label>Photo</label>
                <input
                  id="photo_input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploadingPhoto && (
                  <div className={classes.form_error}>Uploading photo...</div>
                )}
                {photoPreview && (
                  <div className="image-preview">
                    <img
                      style={{ width: "14rem", height: "16rem" }}
                      src={photoPreview}
                      alt="preview"
                    />
                  </div>
                )}
              </div> */}

              <div className={"btn_container"}>
                <Button
                  type="submit"
                  className={classes.btn_primary}
                  disabled={loading}
                >
                  {loading ? "Registering" : "Register"}

                  {loading && (
                    <DotLoader
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        marginBottom: "-0.6rem",
                      }}
                    />
                  )}
                </Button>

                <Button
                  type="button"
                  id={classes.btn_secondary}
                  //   className={classes.btn_secondary}
                  onClick={onCloseModal}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </ModalOverlay>,
        document.getElementById("overlay-root"),
      )}
    </Fragment>
  );
};

AddStudentsModal.propTypes = {
  title: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  toastModal: PropTypes.func,
  refreshTable: PropTypes.func,
};

export default AddStudentsModal;
