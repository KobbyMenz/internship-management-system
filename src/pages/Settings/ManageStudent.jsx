import dayjs from "dayjs";
//import formatDateTime from "../../Functions/formatDateTime";
import PaginationTable from "../../components/UI/PaginationTable/PaginationTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddStudentsModal from "../../components/UI/Modal/AddStudentsModal";
//import EditVoterModal from "../../UI/Modals/EditVoterModal";
import Toast from "../../components/UI/Notification/Toast";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/UI/Button/Button";
import PrintIcon from "../../components/UI/Icons/PrintIcon";
//import { printVoters } from "../../Functions/printVoters";
import useDeleteHook from "../../components/CustomHooks/useDeleteHook";
import useFetch from "../../components/CustomHooks/useFetch";
//import app_api_url from "../../../app_api_url";
import TableSkeleton from "../../components/UI/Skeleton/TableSkeleton";
// import formatDateTime from "../../Functions/formatDateTime";
// import app_api_url from "../../Services/app_api_url";
import classes from "./Settings.module.css";
import ROLES from "../../Services/ROLES";
import EditStudentsModal from "../../components/UI/Modal/EditStudentsModal";

// const allStudents = [
//   {
//     id: 2026001,

//     fullName: "Adu-Boahen Charles",
//     gender: "Male",
//     contact: "0245874744",
//     email: "Adu-BoahenCharles@gmail.com",
//     programme: "Accounting Education",
//   },

//   {
//     id: 2026002,
//     image: "",
//     fullName: "Martha Kwayisi",
//     gender: "Female",
//     contact: "0245874744",
//     email: "marthakwayisis@gmail.com",
//     programme: "Management Education",
//   },

//   {
//     id: 2026004,
//     image: "",
//     fullName: "Cecilia Boateng",
//     gender: "Female",
//     contact: "0245874744",
//     email: "ceciliaboateng@gmail.com",
//     programme: "Management Education",
//   },
// ];

const ManageStudent = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditVoterModal, setShowEditVoterModal] = useState(false);
  const [submitEditData, setSubmitEditData] = useState({});
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  //const [voters, setVoters] = useState([]);

  const { deleteData } = useDeleteHook();
  const role = ROLES.USER; // Set the role based on your application logic

  const { data, setRefetch } = useFetch(`getAllUsers/${role}`); //Getting all users details

  // //Getting all users details
  const allStudents = useMemo(() => (data !== null ? data : []), [data]);

  // Track initial load separately from polling refreshes
  const [initialLoading, setInitialLoading] = useState(true);

  // Only show skeleton on first load, not on polling refreshes
  useEffect(() => {
    if (data !== null) {
      setInitialLoading(false);
    }
  }, [data]);

  // Handler to open the Add Voter Modal
  const onAddUserHandler = useCallback(() => {
    setShowAddUserModal(true);
  }, []);

  // Handler to open edit modal
  const onEditHandler = useCallback((id) => {
    setEditStudentId(id);
    setShowEditUserModal(true);
  }, []);

  // const closeShowEditUserModalHandler = useCallback(() => {
  //   setShowEditUserModal(false);
  // }, []);

  const closeShowAddUserModalHandler = useCallback(() => {
    setShowAddUserModal(false);
  }, []);

  const closeShowEditUserModalHandler = useCallback(() => {
    setShowEditUserModal(false);
    setEditStudentId(null);
  }, []);

  const onEditVoterHandler = useCallback((id, image, name, dob) => {
    setShowEditVoterModal(true);

    setSubmitEditData({
      id: id,
      image: image,
      name: name,
      dob: dob,
    });
  }, []);

  const closeShowEditVoterModalHandler = useCallback(() => {
    setShowEditVoterModal(false);
  }, []);

  //Function to call toast modal
  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  //Function to refresh table
  const setRefetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

  //////////////////////////////////////////
  //Handler to delete voters
  //////////////////////////////////////////
  const onDeleteHandler = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete?")) {
        // setVoters((prev) => {
        //   return Array.isArray(prev)
        //     ? prev.filter((voter) => voter.id !== id)
        //     : prev;
        // });

        deleteData(`deleteVoter/${id}`, ToastHandler);
      }
    },
    [deleteData, ToastHandler],
  );

  /////////////////////////////////////////////////////////
  //* Handler to print all registered voters */
  /////////////////////////////////////////////////////
  const onPrintAllVotersHandler = useCallback(() => {
    if (Array.isArray(allStudents) && allStudents.length > 0) {
      // Format voters data for printing
      const formattedVoters = allStudents.map((voter) => ({
        id: voter.voterId,
        image: voter.photo,
        name: voter.fullName,
        dob: dayjs(voter.DOB).format("DD MMM, YYYY"),
        dateCreated: dayjs(voter.dateCreated).format("DD MMM, YYYY"),
      }));
      //printVoters(formattedVoters, "Registered Voters Report");
    } else {
      Toast("info", "No voters to print");
    }
  }, [allStudents]);

  /// Define columns for the pagination table
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "gender", headerName: "Gender", type: "gender" },
    { field: "contact", headerName: "Phone", type: "contact" },
    { field: "email", headerName: "Email", type: "email" },
    { field: "programme", headerName: "Programme", type: "programme" },
  ];

  // Format rows for the pagination table
  const rows = allStudents.map((student, index) => ({
    sn: index + 1,
    id: student.id,
    image: "",
    name: student.fullName,
    gender: student.gender,
    contact: student.contact,
    email: student.email,
    programme: student.programme,
  }));

  return (
    <>
      {showAddUserModal && (
        <AddStudentsModal
          // onAddVoter={(voterData) =>
          //   onAddUserHandler(showAddUserModal, voterData)
          // }
          toastModal={ToastHandler}
          refreshTable={setRefetchHandler}
          onCloseModal={closeShowAddUserModalHandler}
        />
      )}

      {showEditUserModal && editStudentId && (
        <EditStudentsModal
          studentId={editStudentId}
          fullName={rows.find((row) => row.id === editStudentId)?.name || ""}
          toastModal={ToastHandler}
          refreshTable={setRefetchHandler}
          onCloseModal={closeShowEditUserModalHandler}
        />
      )}

      {/* Edit modal not available yet; remove or implement EditVoterModal to enable editing */}

      <div className={`${classes.table__container}`}>
        <div className="table_wrapper">
          {initialLoading ? (
            <TableSkeleton />
          ) : (
            <PaginationTable
              // key={id}
              columns={columns}
              rows={rows}
              onEdit={onEditHandler}
              onDelete={onDeleteHandler}
              onAdd={onAddUserHandler}
              customHeaderButtons={
                <Button onClick={onPrintAllVotersHandler}>
                  <PrintIcon /> <span>Print</span>
                </Button>
              }
            />
          )}
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};
export default ManageStudent;
