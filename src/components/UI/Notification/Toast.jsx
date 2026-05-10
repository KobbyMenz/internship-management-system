// Toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// reusable toast function
const Toast = (type, message) => {
  const options = {
    position: "bottom-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
    draggable: true,
    progress: undefined,
    closeButton: true,
    // className: "toast_className",
    toastId: message, // Prevent duplicate toasts

    style: {
      fontSize: "1.5rem",
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
      boxShadow: "0rem 0.6rem 1.5rem rgba(0, 0, 0, 0.3)",
      border: "0.2rem solid rgba(255, 255, 255, 0.3)",
      // border: "0.2rem solid var(--bg-color)",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }

  // return <>{/* <ToastContainer /> */}</>;
};
export default Toast;
