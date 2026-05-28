//import axios from "axios";
import { useState } from "react";
import classes from "./ProfileCard.module.css";
//import defaultProfilePicture from "../../../assets/images/profilePicture.png";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
//import ToolTip from "../ToolTip/ToolTip";
//import FormatDate from "../../Functions/FormatDate";
import formatName from "../../../Functions/formatName";
//import moment from "moment";
//import ProfileCardSkeleton from "../Skeleton/ProfileCardSkeleton";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
// import Person from "@mui/icons-material/Person";
// import Logout from "@mui/icons-material/Logout";
import QuestionModal from "../Modal/QuestionModal";
//import ToolTip from "../ToolTip/ToolTip";
import Card from "../Card/Card";
import ImageBox from "../ImageBox/ImageBox";
import ROLES from "../../../Services/ROLES";
import User from "../Icons/UserIcon";
import Logout from "../Icons/LogoutIcon";
//import app_api_url from "../../../Services/app_api_url";
import { useAuth } from "../../../context/useAuth";

//Profile menu list
const settings = [
  { key: "profile", label: "Profile", Icon: User },
  { key: "logout", label: "Logout", Icon: Logout },
];

const ProfileCard = () => {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  // const [selectedImage, setSelectedImage] = useState("");
  //const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  //////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   //Fetching profile picture from the backend

  //   // const userDataFromLocalStorage = authLocalStorage();
  //   // const userId = userDataFromLocalStorage.userId;

  //   axios
  //     .get(`${app_api_url}/getUserProfilePicture/${user.userId}`)
  //     .then((response) => {
  //       if (
  //         response.data.profilePicture !== null ||
  //         response.data.profilePicture !== ""
  //       ) {
  //         setSelectedImage(
  //           response.data.profilePicture
  //             ? `${response.data.profilePicture}`
  //             : props.profileImage,
  //         );

  //         //setLoading(false);
  //         // console.log("response: ", selectedImage);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data.error);
  //       //setLoading(false);
  //     });
  // }, [selectedImage, props.profileImage, user.userId]);
  //////////////////////////////////////////////////////

  //Navigating to the various user profile
  const navigate = useNavigate();
  const onClickProfileHandler = () => {
    //Navigate to profile
    navigate("/profile");
  };

  //Profile menu state handlers
  const [anchorElUser, setAnchorElUser] = useState(null);

  //Open profile menu handler
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  //Close profile menu handler
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //Confirm handler of logout modal
  const onConfirmHandler = () => {
    setShowQuestionModal(false);
    logout();
  };

  //Handler to show logout modal
  const onShowQuestionModalHandler = () => {
    setShowQuestionModal(true);
  };

  //Handler to close logout modal
  const closeQuestionModalHandler = () => {
    setShowQuestionModal(false);
  };

  return (
    <>
      {/* =======Logout modal ==========*/}
      {showQuestionModal && (
        <QuestionModal
          title={showQuestionModal.title}
          message={showQuestionModal.message}
          onCloseModal={closeQuestionModalHandler}
          onConfirm={onConfirmHandler}
        />
      )}

      {
        // loading ? (
        //   <ProfileCardSkeleton />
        // ) :
        <div className={classes.user_details_container}>
          {/*=========== Profile Menu =======s=====*/}
          <div className={classes.avatar_container}>
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 0 }}>
                {/* <ToolTip title="Open menu"> */}
                {/*=========== Profile Picture ==============*/}
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    height: "4.1rem",
                    width: "75%",
                    borderRadius: "2rem",
                    // padding: "5rem",
                    "&:hover": {
                      background: "var(--bg-color2)",
                    },
                  }}
                >
                  <ImageBox
                    width="4.1rem"
                    height="4.1rem"
                    borderRadius="50%"
                    // src={selectedImage}
                    alt="profile picture"
                    background="var(--primary)"
                    border="2px solid #fff"
                  />

                  {/*======= user and last login details ===========*/}
                  <div className={classes.user_details}>
                    <p className={classes.user_name}>
                      {user.fullName
                        ? formatName(user.fullName).split(" ")[0]
                        : user.role === ROLES.ADMIN
                          ? "Admin"
                          : "User"}
                    </p>
                  </div>
                </IconButton>
                {/* </ToolTip> */}

                {/*======= Menu popup ========*/}
                <Card>
                  <Menu
                    sx={{ mt: "4.5rem" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    paperprops={{
                      sx: {
                        maxWidth: "calc(100vw - 2rem)",
                        // boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.15)",
                        boxShadow: "0rem 0.5rem 1.5rem rgba(0, 0, 0, 0.25)",
                        p: 0,
                      },
                    }}
                  >
                    {settings.map((setting) => {
                      const { key, label, Icon } = setting;
                      return (
                        <MenuItem
                          key={key}
                          onClick={() => {
                            handleCloseUserMenu();
                            if (key === "profile") onClickProfileHandler();
                            if (key === "logout") onShowQuestionModalHandler();
                          }}
                          sx={{
                            py: 1.25,
                            width: "12rem",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            transition: "background-color 200ms, color 200ms",
                            "&:hover": {
                              backgroundColor: "var(--primary)",
                              color: "#fff",
                            },
                          }}
                        >
                          <Icon
                            sx={{
                              fontSize: "1.6rem",
                              color: "inherit",
                              "&:hover": {
                                backgroundColor: "inherit",
                                color: "#fff",
                              },
                            }}
                          />
                          <Typography sx={{ fontSize: "1.5rem" }}>
                            {label}
                          </Typography>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Card>
              </Box>
            </Toolbar>
          </div>
        </div>
      }
    </>
  );
};
ProfileCard.propTypes = {
  profileImage: PropTypes.string,
};
export default ProfileCard;
