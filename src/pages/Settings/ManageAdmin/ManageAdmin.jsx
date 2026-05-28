import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
//import classes from "../dashboard/DashboardContent.module.css";
//import styles from "../AdminStaff/AdminStaffContent.module.css";
//import defaultUserPhoto from "../../../assets/images/profilePicture.png";
import Card from "../../../components/UI/Card/Card";
//import Button from "../../UI/Button";
import PropTypes from "prop-types";
// import Loader from "../../UI/Loader/Loader";
// import Modal from "../../UI/Modals/Modal";
//import axios from "axios";
// import Footer from "../../Footer/Footer";
//import ToolTip from "../../UI/ToolTip/ToolTip";
//import ErrorIcon from "../../UI/ErrorIcon";
// import OkayIcon from "../../UI/OkayIcon";
// import InfoIcon from "../../UI/InfoIcon";
//import ImageBox from "../../UI/ImageBox/ImageBox";
// import Toast from "../../UI/Notification/Toast";
//import PaginationTableWithImage from "../../UI/PaginationTable/PaginationTableWithImage";
import ManageUserPT from "../../../components/UI/PaginationTable/ManageUserPT";
// import AddUserModal from "../../UI/Modals/AddUserModal";
//import UpdateUserModal from "../../UI/Modals/UpdateUserModal";
import formatDateTime from "../../../Functions/formatDateTime";
//import useFetch from "../../CustomHooks/useFetchHook";
import TableSkeleton from "../../../components/UI/Skeleton/TableSkeleton";
//import NavTabs from "../../UI/Tab/NavTabs";
import classes from "../Settings.module.css";
//import useFetchHook from "../../CustomHooks/useFetchHook";
import Footer from "../../../components/Footer/Footer";
import Toast from "../../../components/UI/Notification/Toast";
import app_api_url from "../../../Services/app_api_url";
import useDeleteHook from "../../../components/CustomHooks/useDeleteHook";
import useUpdateHook from "../../../components/CustomHooks/useUpdateHook";
import useFetch from "../../../components/CustomHooks/useFetch";
import { useAuth } from "../../../context/useAuth";
import ROLES from "../../../Services/ROLES";

//Getting all users details
const dummyUsers = [
  {
    userId: 2025001,
    image: "",
    name: "Augustine Mensah",
    userName: "KobbyMenz",
    email: "kmz@email",
    contact: "0546163240",
    // role: "Admin",
    userStatus: "Enabled",
    dateCreated: formatDateTime("2026-02-02T02:00"),
    lastLogin: formatDateTime("2026-02-02T02:00"),
  },

  {
    userId: 2025002,
    image: "",
    name: "Enoch Boakye",
    userName: "KobbyMenz",
    email: "enoch@email",
    contact: "0546163240",
    // role: "Admin",
    userStatus: "Disabled",
    dateCreated: formatDateTime("2026-02-02T02:00"),
    lastLogin: formatDateTime("2026-02-02T02:00"),
  },

  {
    userId: 2025003,
    image: "",
    name: "Emmanuel Adu Darkwah",
    userName: "emmanueladu@gmail.com",
    email: "enoch@email",
    contact: "0546163240",
    // role: "Admin",
    userStatus: "Enabled",
    dateCreated: formatDateTime("2026-02-02T02:00"),
    lastLogin: formatDateTime("2026-02-02T02:00"),
  },

  {
    userId: 2025004,
    image: "",
    name: "Alex Baah",
    userName: "KobbyMenz",
    email: "Alexakwasi@gmail.com",
    contact: "0546163240",
    // role: "Admin",
    userStatus: "Disabled",
    dateCreated: formatDateTime("2026-02-02T02:00"),
    lastLogin: formatDateTime("2026-02-02T02:00"),
  },
];

//import moment from "moment";

const ManageAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [submit, setSubmit] = useState({});
  // const [users, setUsers] = useState([]);

  const { deleteData } = useDeleteHook();
  const { updateData } = useUpdateHook();

  const { user } = useAuth();

  const role = ROLES.ADMIN; // Set the role based on your application logic

  const { data, setRefetch } = useFetch(`getAllUsers/${role}`); //Getting all users details

  // //Getting all users details
  const allUsers = useMemo(() => (data !== null ? data : []), [data]);

  // Track initial load separately from polling refreshes
  const [initialLoading, setInitialLoading] = useState(true);

  // Only show skeleton on first load, not on polling refreshes
  useEffect(() => {
    if (data !== null) {
      setInitialLoading(false);
    }
  }, [data]);

  //console.log("All users: ", allUsers);

  // const { data, loading, setRefetch } = useFetch(`${app_api_url}/getAllUsers`); //Getting all users details

  //  useMemo(
  //   () =>
  //     data !== null
  //       ?
  //       : [],
  //   [data],
  // );

  const closeShowModalHandler = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeShowAddModalHandler = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onShowAddModalHandler = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const onShowUpdateUserModalHandler = useCallback(() => {
    setShowUpdateUserModal(true);
  }, []);

  const closeShowUpdateUserModalHandler = useCallback(() => {
    setShowUpdateUserModal(false);
  }, []);

  //Function to call toast modal
  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  //Function to refresh table
  const setRefetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

  ////////////////////////////////////////////////
  //TOGGLE USER ACCOUNT STATUS
  ////////////////////////////////////////////////
  const toggleStatus = useCallback(
    (userId, currentStatus, name) => {
      //Getting user ID from local storage

      //Preventing the logged-in user from disabling their own account
      if (userId === user.userId) {
        Toast("warning", `This account cannot be disabled while logged in!`);
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to ${
            currentStatus === "Enabled" ? "disable" : "enable"
          } this account?`,
        )
      ) {
        try {
          let newStatus;

          /*Toggling user status.
        If userId matches the storedUserId, then do not change status
        */
          allUsers.forEach((userData) => {
            if (userData.userId === user.userId) {
              if (userId === user.userId) {
                newStatus = currentStatus;
                return;
              }
              newStatus = currentStatus === "Enabled" ? "Disabled" : "Enabled";
            }
          });

          updateData(
            `updateUserStatus/${userId}`,
            { userStatus: newStatus, fullName: name },
            ToastHandler,
            setRefetchHandler,
          );
        } catch (err) {
          Toast("error", `Error changing user status: ${err}`);
        }
      }
    },
    [allUsers, updateData, ToastHandler, setRefetchHandler, user.userId],
  );

  ///////////////////////////////////////////
  // Delete user
  //////////////////////////////////////////////
  const deleteHandler = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete")) {
        deleteData(`deleteUser/${id}`, ToastHandler, setRefetchHandler);
      }
    },
    [deleteData, setRefetchHandler, ToastHandler],
  );

  ///////////////////////////////////////////////
  // Edit user details
  ///////////////////////////////////////////////
  const onEditHandler = useCallback(
    (id, image, name, email, contact, role) => {
      //showing UpdateUserModal after clicking on edit button
      onShowUpdateUserModalHandler();

      //setting user details to updateUserModal
      setSubmit({
        id: id,
        image: image,
        name: name,
        email: email,
        contact: contact,
        role: role,
      });
    },
    [onShowUpdateUserModalHandler],
  );

  /////////////////////////////////////////

  //columns for pagination table (ManageUserPT)
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "photo" },
    { field: "name", headerName: "Full Name" },
    { field: "userName", headerName: "UserName", type: "userName" },
    { field: "email", headerName: "Email" },
    { field: "contact", headerName: "Phone" },
    // { field: "role", headerName: "Role", type: "role" },
    { field: "userStatus", headerName: "Account Status", type: "status" },
    { field: "dateCreated", headerName: "Date Created" },
    // { field: "lastLogin", headerName: "Last Login Date" },
  ];

  //rows for pagination table (ManageUserPT)
  const rows = allUsers.map((user, index) => {
    //const loginDate = user.lastLogin;

    const dateCreated = user.dateCreated;

    return {
      sn: index + 1,
      id: user.id,
      image: user.photo ? user.photo : "",
      name: user.fullName,
      // userName: user.userName,
      email: user.email,
      contact: user.contact,
      // role: user.role,
      userStatus: user.userStatus,
      dateCreated:
        dateCreated === null || dateCreated === ""
          ? ""
          : formatDateTime(dateCreated),

      // lastLogin:
      //   loginDate === "" || loginDate === null
      //     ? "Not Available"
      //     : formatDateTime(loginDate),
    };
  });

  // const tabs = [
  //   { label: "System Settings", to: "/settings" },
  //   { label: "Manage Users", to: "/manageUsers" },
  // ];

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {showModal && (
        <Modal
          title={showModal.title}
          icon={showModal.icon}
          message={showModal.message}
          onCloseModal={closeShowModalHandler}
        />
      )}

      {showAddModal && (
        <AddUserModal
          toastModal={ToastHandler}
          setRefetch={setRefetchHandler}
          onCloseModal={closeShowAddModalHandler}
          allUsers={allUsers}
        />
      )}

      {showUpdateUserModal && (
        <UpdateUserModal
          toastModal={ToastHandler}
          userData={submit}
          setRefetch={setRefetchHandler}
          onCloseModal={closeShowUpdateUserModalHandler}
        />
      )}

      <div className={`${classes.table__container}`}>
        <div className="table_wrapper">
          {initialLoading ? (
            <TableSkeleton />
          ) : (
            <ManageUserPT
              columns={columns}
              rows={rows}
              onEdit={onEditHandler}
              onDelete={deleteHandler}
              toggleStatus={toggleStatus}
              onAdd={onShowAddModalHandler}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </Fragment>
  );
};
ManageAdmin.propTypes = {
  onClicked: PropTypes.func,
  show: PropTypes.bool,
  closeLoader: PropTypes.func,
  data: PropTypes.array,
  setRefetch: PropTypes.func,
  loading: PropTypes.bool,
};
export default ManageAdmin;
