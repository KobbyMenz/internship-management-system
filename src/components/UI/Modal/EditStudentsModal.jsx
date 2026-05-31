import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Card from "../Card/Card";
import CloseIcon from "../Icons/CloseIcon";
import Button from "../Button/Button";
import "../Modal/Modal.css";
import classes from "../../Form/SignIn.module.css";
import Toast from "../../UI/Notification/Toast";
import PasswordInput from "../../UI/PasswordInput/PasswordInput";
import app_api_url from "../../../Services/app_api_url";
import ROLES from "../../../Services/ROLES";
import programmeOptions from "../../../Services/programmeOptions";
import titleOptions from "../../../Services/titleOptions";
import qualificationOptions from "../../../Services/qualificationOptions";
import statusOptions from "../../../Services/statusOptions";
import { ghanaRegions } from "../../../Services/ghanaRegions";
import Box from "@mui/material/Box";
import axios from "axios";
import EditStudentsModalSkeleton from "../Skeleton/EditStudentsModalSkeleton";

const Backdrop = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose} />
);

const ModalOverlay = ({ onClose, title, children }) => (
  <Card
    className="modal-card"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <header className="header">
      <h3 id="modal-title" className="modal-title">
        {title}
      </h3>

      <button
        type="button"
        className="close_btn"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <CloseIcon />
      </button>
    </header>

    <div className="content">{children}</div>
  </Card>
);

const steps = ["Student", "School", "Mentor", "Head"];

const EditStudentsModal = ({
  onCloseModal,
  studentId,
  fullName,
  toastModal,
  refreshTable,
}) => {
  const toast = toastModal || Toast;
  const notify = useCallback((t, m) => toast(t, m), [toast]);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasSchool, setHasSchool] = useState(false);
  const [hasMentor, setHasMentor] = useState(false);
  const [hasHead, setHasHead] = useState(false);

  const {
    register: sRegister,
    handleSubmit: sHandleSubmit,
    resetField,
    reset: sReset,
    // setError: sSetError,
    formState: { errors: sErrors },
  } = useForm();

  const {
    register: mRegister,
    handleSubmit: mHandleSubmit,
    reset: mReset,
    // setError: mSetError,
    formState: { errors: mErrors },
  } = useForm();

  const {
    register: scRegister,
    handleSubmit: scHandleSubmit,
    reset: scReset,
    // setError: scSetError,
    formState: { errors: scErrors },
    control: scControl,
  } = useForm();

  const scSelectedRegion = useWatch({ control: scControl, name: "region" });

  const {
    register: hRegister,
    handleSubmit: hHandleSubmit,
    reset: hReset,
    // setError: hSetError,
    formState: { errors: hErrors },
  } = useForm();

  const firstRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, scRes, mRes, hRes] = await Promise.all([
          fetch(`${app_api_url}/getUser/${studentId}/${ROLES.USER}`),
          fetch(`${app_api_url}/getSchoolDetails/${studentId}`),
          fetch(`${app_api_url}/getInstructor/${studentId}/mentor`),
          fetch(`${app_api_url}/getInstructor/${studentId}/head`),
        ]);

        const uJson = await uRes.json();
        const scJson = await scRes.json();
        const mJson = await mRes.json();
        const hJson = await hRes.json();

        if (uRes.ok) {
          sReset({
            userId: uJson.userId,
            fullName: uJson.fullName,
            contact: uJson.contact,
            email: uJson.email,
            programme: uJson.programme,
            gender: uJson.gender,
          });
        }

        //
        if (scRes.ok) {
          // If API returned an actual record (studentId present), treat as existing
          const hasRecord = scJson && scJson.studentId;
          scReset({
            studentId: scJson.studentId || "",
            schoolName: scJson.schoolName || "",
            schoolAddress: scJson.schoolAddress || "",
            town: scJson.town || "",
            region: scJson.region || "",
            district: scJson.district || "",
          });
          setHasSchool(Boolean(hasRecord));
        }

        if (mRes.ok) {
          // API returns empty fields with 200 when no record exists — check name/studentId
          const hasRecord = mJson && (mJson.name || mJson.studentId);
          mReset({
            title: mJson.title || "",
            name: mJson.name || "",
            contact: mJson.contact || "",
            qualification: mJson.qualification || "",
            status: mJson.status || "",
            momoNumber: mJson.momoNumber || "",
          });
          setHasMentor(Boolean(hasRecord));
        }

        if (hRes.ok) {
          const hasRecord = hJson && (hJson.name || hJson.studentId);
          hReset({
            title: hJson.title || "",
            name: hJson.name || "",
            contact: hJson.contact || "",
            qualification: hJson.qualification || "",
            status: hJson.status || "",
            momoNumber: hJson.momoNumber || "",
          });
          setHasHead(Boolean(hasRecord));
        }
      } catch (err) {
        console.error(err);
        notify("error", "Failed to load details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAll();
  }, [studentId, sReset, scReset, mReset, hReset, notify]);

  useEffect(() => {
    try {
      firstRef.current?.focus();
    } catch (err) {
      console.error(err);
    }
  }, [page]);

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

  //button handlers for next and prev page
  const goNext = () => setPage((p) => Math.min(p + 1, steps.length - 1));
  const goPrev = () => setPage((p) => Math.max(p - 1, 0));

  //Student save handler
  const saveStudent = async (data) => {
    setLoading(true);
    setGeneralError("");
    try {
      const response = await axios.put(
        `${app_api_url}/updateUser/${data.userId}/${ROLES.USER}`,
        data,
      );

      if (response.data.message) {
        resetField("password");

        notify("success", `${response.data.message}`);
        setSuccessMessage(`${response.data.message}`);
        setTimeout(() => setSuccessMessage(""), 6000);
        if (typeof refreshTable === "function") refreshTable();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Toast("error", err.response.data.error);
      } else {
        //alert("Server cannot be reached", err);
        notify("error", "Server cannot be reached.");
        setGeneralError("Server cannot be reached.");
        // console.log("error", `Server cannot be reached. ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveInstructor = async (data, routeName) => {
    setLoading(true);
    setGeneralError("");
    try {
      const response = await axios.put(
        `${app_api_url}/updateInstructor/${studentId}/${routeName}`,
        data,
      );

      if (response.data.message) {
        notify("success", `${response.data.message}`);
        setSuccessMessage(`${response.data.message}`);
        setTimeout(() => setSuccessMessage(""), 6000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Toast("error", err.response.data.error);
      } else {
        //alert("Server cannot be reached", err);
        notify("error", "Server cannot be reached.");
        setGeneralError("Server cannot be reached.");
      }
    } finally {
      setLoading(false);
    }
  };

  //Save School details
  const saveSchool = async (data) => {
    setLoading(true);
    setGeneralError("");

    try {
      const response = await axios.put(
        `${app_api_url}/updateSchoolDetails/${studentId}`,
        data,
      );

      if (response.data.message) {
        notify("success", `${response.data.message}`);
        setSuccessMessage(`${response.data.message}`);
        setTimeout(() => setSuccessMessage(""), 6000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Toast("error", err.response.data.error);
      } else {
        Toast("error", "Server cannot be reached");
        setGeneralError("Server cannot be reached.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Insert school details when no record exists
  const insertSchool = async (data) => {
    setLoading(true);
    setGeneralError("");

    try {
      const response = await axios.post(
        `${app_api_url}/insertShoolDetails/${studentId}`,
        data,
      );

      if (response.data.message) {
        setHasSchool(true);
        notify("success", `${response.data.message}`);
        setSuccessMessage(`${response.data.message}`);
        setTimeout(() => setSuccessMessage(""), 6000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Toast("error", err.response.data.error);
      } else {
        Toast("error", "Server cannot be reached");
        setGeneralError("Server cannot be reached.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Insert instructor (mentor/head)
  const insertInstructor = async (data, routeName) => {
    setLoading(true);
    setGeneralError("");
    try {
      const response = await axios.post(
        `${app_api_url}/insertInstructor/${studentId}/${routeName}`,
        data,
      );

      if (response.data.message) {
        if (routeName === "mentor") setHasMentor(true);
        if (routeName === "head") setHasHead(true);

        notify("success", ` ${response.data.message}`);
        setSuccessMessage(`${response.data.message}`);
        setTimeout(() => setSuccessMessage(""), 6000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Toast("error", err.response.data.error);
      } else {
        Toast("error", "Server cannot be reached");
        setGeneralError("Server cannot be reached.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={onCloseModal} />,
        document.getElementById("backdrop-root"),
      )}

      {ReactDOM.createPortal(
        <ModalOverlay onClose={onCloseModal} title={`Edit: ${fullName}`}>
          <div className={classes.form_box_container} ref={modalRef}>
            {generalError && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: "#ca0202",
                  marginBottom: "0.6rem",
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

            <Box
              sx={{
                gridColumn: "1 / -1",
                marginBottom: "0.6rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                "@media (max-width: 750px)": {
                  flexDirection: "column",
                  gap: "0.6rem",
                },
              }}
            >
              <h3 style={{ margin: 0, color: "var(--primary)" }}>
                {page === 0
                  ? "STUDENT DETAILS"
                  : page === 1
                    ? "SCHOOL DETAILS"
                    : page === 2
                      ? "MENTOR DETAILS"
                      : "HEAD DETAILS"}
              </h3>

              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                {steps.map((s, i) => (
                  <Button
                    key={s}
                    type="button"
                    onClick={() => setPage(i)}
                    id={
                      i === page ? classes.btn_primary : classes.btn_secondary
                    }
                    style={{ padding: "0.6rem 2rem" }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </Box>

            {initialLoading ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <EditStudentsModalSkeleton />
              </div>
            ) : (
              <>
                {/*============ Student page ============*/}
                {page === 0 && (
                  <form
                    style={{ display: "contents" }}
                    onSubmit={sHandleSubmit(saveStudent)}
                  >
                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label>
                          Index Number
                          <span className={classes.required_field}>*</span>
                        </label>
                        <input
                          ref={firstRef}
                          className={classes.input}
                          {...sRegister("userId")}
                          readOnly
                        />
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="fullName">
                          Full Name
                          <span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            sErrors.fullName
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="text"
                          id="fullName"
                          placeholder="Enter your full name"
                          {...sRegister("fullName", {
                            required: "Full name is required",
                          })}
                        />
                        {sErrors.fullName && (
                          <small className="error">
                            {sErrors.fullName.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label>
                          Gender<span className="required_field">*</span>
                        </label>
                        <select
                          className={
                            sErrors.gender
                              ? `${classes.error} ${classes.select}`
                              : `${classes.select} `
                          }
                          {...sRegister("gender", {
                            required: "Please select a gender",
                          })}
                        >
                          <option value="">Select a gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          {/* <option value="Other">Other</option> */}
                        </select>
                        {sErrors.gender && (
                          <div className={classes.form_error}>
                            {sErrors.gender.message}
                          </div>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label>
                          Phone<span className="required_field">*</span>
                        </label>
                        <input
                          className={
                            sErrors.contact
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          placeholder="Enter phone number"
                          {...sRegister("contact", {
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
                        {sErrors.contact && (
                          <div className={classes.form_error}>
                            {sErrors.contact.message}
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
                            sErrors.email
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          placeholder="Enter your email"
                          {...sRegister("email", {
                            required: "Email is required",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Enter a valid email",
                            },
                          })}
                        />
                        {sErrors.email && (
                          <div className={classes.form_error}>
                            {sErrors.email.message}
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
                            sErrors.programme
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          list="programmeOption"
                          id="programme"
                          type="text"
                          placeholder="Select your programme of study"
                          {...sRegister("programme", {
                            required: "Please select an option",
                          })}
                        />
                        {sErrors.programme && (
                          <small className="error">
                            {sErrors.programme.message}
                          </small>
                        )}

                        <datalist id="programmeOption">
                          {programmeOptions.sort().map((optionValue, index) => (
                            <option key={index} value={optionValue} />
                          ))}
                        </datalist>
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="password">
                          Password (Leave blank to keep)
                        </label>

                        <PasswordInput
                          className={
                            sErrors.password
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="password"
                          id="password"
                          placeholder="Enter your new password"
                          {...sRegister("password", {
                            // required: "Password is required",
                            minLength: {
                              value: 8,
                              message:
                                "Password must be at least 8 characters long",
                            },
                          })}
                        />
                        {sErrors.password && (
                          <small className="error">
                            {sErrors.password.message}
                          </small>
                        )}
                      </div>

                      <div className={"btn_container"}>
                        <Button
                          type="button"
                          className={classes.btn_secondary}
                          onClick={goNext}
                        >
                          Next
                        </Button>
                        <Button
                          type="submit"
                          className={classes.btn_primary}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </Button>

                        <Button
                          type="button"
                          onClick={onCloseModal}
                          id={classes.btn_secondary}
                          // disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/*============ School page ============*/}
                {page === 1 && (
                  <form
                    style={{ display: "contents" }}
                    onSubmit={scHandleSubmit((d) =>
                      hasSchool ? saveSchool(d) : insertSchool(d),
                    )}
                  >
                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label>School Name</label>
                        <input
                          className={classes.input}
                          {...scRegister("schoolName", {
                            required: "School name is required",
                          })}
                        />
                        {scErrors.schoolName && (
                          <small className="error">
                            {scErrors.schoolName.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label>School Address</label>
                        <input
                          className={classes.input}
                          {...scRegister("schoolAddress", {
                            required: "School address is required",
                          })}
                        />
                        {scErrors.schoolAddress && (
                          <small className="error">
                            {scErrors.schoolAddress.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label>Town</label>
                        <input
                          className={classes.input}
                          {...scRegister("town", {
                            required: "Town is required",
                          })}
                        />
                        {scErrors.town && (
                          <small className="error">
                            {scErrors.town.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label>Region</label>
                        <select
                          className={classes.input}
                          {...scRegister("region", {
                            required: "Region is required",
                          })}
                        >
                          <option value="">-- Select region --</option>
                          {ghanaRegions.map((r) => (
                            <option key={r.region} value={r.region}>
                              {r.region}
                            </option>
                          ))}
                        </select>
                        {scErrors.region && (
                          <small className="error">
                            {scErrors.region.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label>District</label>
                        <select
                          className={classes.input}
                          {...scRegister("district", {
                            required: "District is required",
                          })}
                        >
                          <option value="">-- Select district --</option>
                          {ghanaRegions
                            .find((r) => r.region === scSelectedRegion)
                            ?.districts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                        </select>
                        {scErrors.district && (
                          <small className="error">
                            {scErrors.district.message}
                          </small>
                        )}
                      </div>

                      <div className={"btn_container"}>
                        <div
                          style={{
                            // marginLeft: "auto",
                            display: "flex",
                            gap: "0.6rem",
                          }}
                        >
                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={goPrev}
                          >
                            Prev
                          </Button>

                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={goNext}
                          >
                            Next
                          </Button>
                          <Button
                            type="submit"
                            className={classes.btn_primary}
                            disabled={loading}
                          >
                            {loading && hasSchool
                              ? "Saving..."
                              : loading && !hasSchool
                                ? "Adding..."
                                : hasSchool
                                  ? "Save"
                                  : "Add"}
                          </Button>

                          <Button
                            type="button"
                            onClick={onCloseModal}
                            id={classes.btn_secondary}
                            // disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/*============ Mentor page ============*/}
                {page === 2 && (
                  <form
                    style={{ display: "contents" }}
                    onSubmit={mHandleSubmit((d) =>
                      hasMentor
                        ? saveInstructor(d, "mentor")
                        : insertInstructor(d, "mentor"),
                    )}
                  >
                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label htmlFor="title">
                          Title<span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            mErrors.title
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="title"
                          {...mRegister("title", {
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
                        {mErrors.title && (
                          <small className="error">
                            {mErrors.title.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="name">
                          Mentor Name
                          <span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            mErrors.name
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="text"
                          id="name"
                          placeholder="Enter mentor's name"
                          {...mRegister("name", {
                            required: "Mentor's name is required",
                          })}
                        />
                        {mErrors.name && (
                          <small className="error">
                            {mErrors.name.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="contact">
                          Phone<span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            mErrors.contact
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="tel"
                          id="contact"
                          placeholder="Enter mentor's contact number"
                          {...mRegister("contact", {
                            required: "Phone number is required",
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
                        {mErrors.contact && (
                          <small className="error">
                            {mErrors.contact.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label htmlFor="qualification">
                          Qualification
                          <span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            mErrors.qualification
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="qualification"
                          {...mRegister("qualification", {
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
                        {mErrors.qualification && (
                          <small className="error">
                            {mErrors.qualification.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="status">
                          Status
                          <span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            mErrors.status
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="status"
                          {...mRegister("status", {
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
                        {mErrors.status && (
                          <small className="error">
                            {mErrors.status.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="momoNumber">
                          Mobile Money Number
                          <span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            mErrors.momoNumber
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="tel"
                          id="momoNumber"
                          placeholder="Enter mentor's mobile money number"
                          {...mRegister("momoNumber", {
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
                        {mErrors.momoNumber && (
                          <small className="error">
                            {mErrors.momoNumber.message}
                          </small>
                        )}
                      </div>

                      <div className={"btn_container"}>
                        <div
                          style={{
                            // marginLeft: "auto",
                            display: "flex",
                            gap: "0.6rem",
                          }}
                        >
                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={goPrev}
                          >
                            Prev
                          </Button>

                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={goNext}
                          >
                            Next
                          </Button>

                          <Button
                            type="submit"
                            className={classes.btn_primary}
                            disabled={loading}
                          >
                            {loading && hasMentor
                              ? "Saving..."
                              : loading && !hasMentor
                                ? "Adding..."
                                : hasMentor
                                  ? "Save"
                                  : "Add"}
                          </Button>

                          <Button
                            type="button"
                            onClick={onCloseModal}
                            id={classes.btn_secondary}
                            // disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/*============ Head page ============*/}
                {page === 3 && (
                  <form
                    style={{ display: "contents" }}
                    onSubmit={hHandleSubmit((d) =>
                      hasHead
                        ? saveInstructor(d, "head")
                        : insertInstructor(d, "head"),
                    )}
                  >
                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label htmlFor="title">
                          Title<span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            hErrors.title
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="title"
                          {...hRegister("title", {
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
                        {hErrors.title && (
                          <small className="error">
                            {hErrors.title.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="name">
                          head Name
                          <span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            hErrors.name
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="text"
                          id="name"
                          placeholder="Enter head's name"
                          {...hRegister("name", {
                            required: "head's name is required",
                          })}
                        />
                        {hErrors.name && (
                          <small className="error">
                            {hErrors.name.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="contact">
                          Phone<span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            hErrors.contact
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="tel"
                          id="contact"
                          placeholder="Enter head's contact number"
                          {...hRegister("contact", {
                            required: "Phone number is required",
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
                        {hErrors.contact && (
                          <small className="error">
                            {hErrors.contact.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className={classes.form_box}>
                      <div className={classes.form_control}>
                        <label htmlFor="qualification">
                          Qualification
                          <span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            hErrors.qualification
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="qualification"
                          {...hRegister("qualification", {
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
                        {hErrors.qualification && (
                          <small className="error">
                            {hErrors.qualification.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="status">
                          Status
                          <span className={classes.required_field}>*</span>
                        </label>
                        <select
                          className={
                            hErrors.status
                              ? `${classes.error} ${classes.select}`
                              : `${classes.input} `
                          }
                          id="status"
                          {...hRegister("status", {
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
                        {hErrors.status && (
                          <small className="error">
                            {hErrors.status.message}
                          </small>
                        )}
                      </div>

                      <div className={classes.form_control}>
                        <label htmlFor="momoNumber">
                          Mobile Money Number
                          <span className={classes.required_field}>*</span>
                        </label>

                        <input
                          className={
                            hErrors.momoNumber
                              ? `${classes.error} ${classes.input}`
                              : `${classes.input} `
                          }
                          type="tel"
                          id="momoNumber"
                          placeholder="Enter head's mobile money number"
                          {...hRegister("momoNumber", {
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
                        {hErrors.momoNumber && (
                          <small className="error">
                            {hErrors.momoNumber.message}
                          </small>
                        )}
                      </div>

                      <div className={"btn_container"}>
                        <div
                          style={{
                            // marginLeft: "auto",
                            display: "flex",
                            gap: "0.6rem",
                          }}
                        >
                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={goPrev}
                          >
                            Prev
                          </Button>

                          <Button
                            type="button"
                            className={classes.btn_secondary}
                            onClick={() => setPage(0)}
                          >
                            First
                          </Button>

                          <Button
                            type="submit"
                            className={classes.btn_primary}
                            disabled={loading}
                          >
                            {loading && hasHead
                              ? "Saving..."
                              : loading && !hasHead
                                ? "Adding..."
                                : hasHead
                                  ? "Save"
                                  : "Add"}
                          </Button>

                          <Button
                            type="button"
                            onClick={onCloseModal}
                            id={classes.btn_secondary}
                            // disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </ModalOverlay>,
        document.getElementById("overlay-root"),
      )}
    </>
  );
};

EditStudentsModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  fullName: PropTypes.string.isRequired,
  toastModal: PropTypes.func,
  refreshTable: PropTypes.func,
};

export default EditStudentsModal;
