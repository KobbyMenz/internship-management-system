import { Fragment, useEffect, useState } from "react";
import classes from "../Dashboard/Dashboard.module.css";
import Card from "../../components/UI/Card/Card";
import PropTypes from "prop-types";
import CustomCalendar from "../../components/UI/Calendar/CustomCalendar";
import Footer from "../../components/Footer/Footer";
import SystemOverviewSkeleton from "../../components/UI/Skeleton/SystemOverviewSkeleton";
import DigitalClock from "../../components/UI/Clock/DigitalClock";
import { useAuth } from "../../context/useAuth";
import formatName from "../../Functions/formatName";
import SchoolIcon from "../../components/UI/Icons/SchoolIcon";
import WorkPlaceIcon from "../../components/UI/Icons/WorkPlaceIcon";
import ProgrammeIcon from "../../components/UI/Icons/ProgrammeIcon";
import TelephoneIcon from "../../components/UI/Icons/TelephoneIcon";
import StudentIcon from "../../components/UI/Icons/StudentIcon";
import NumberIcon from "../../components/UI/Icons/NumberIcon";
import app_api_url from "../../Services/app_api_url";
import axios from "axios";
import WelcomeMessageSkeleton from "../../components/UI/Skeleton/WelcomeMessageSkeleton";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [studentData, setStudentData] = useState({
    studentId: "",
    fullName: "",
    contact: "",
    email: "",
    programme: "",
    schoolName: "",
    district: "",
  });

  //

  const fullName = studentData.fullName ? studentData.fullName : "";
  const studentId = studentData.userId ? studentData.userId : "N/A";
  const contact = studentData.contact ? studentData.contact : "N/A";
  const programme = studentData.programme ? studentData.programme : "N/A";
  const schoolName = studentData.schoolName ? studentData.schoolName : "N/A";
  const district = studentData.district ? studentData.district : "N/A";

  useEffect(() => {
    const getStudentData = async () => {
      try {
        const response = await axios.get(
          `${app_api_url}/getUser/${user.userId}/${user.role}`,
        );

        setStudentData(response.data);
        if (response.data) setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getStudentData();
  }, [user.userId, user.role]);

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      <div className={`${classes.content__container} `}>
        <Card className={`${classes.card__wrapper} ${classes.welcome_card}`}>
          {loading ? (
            <WelcomeMessageSkeleton />
          ) : (
            <div className={classes.message_container}>
              <div className={classes.welcome_text}>
                <h2 className={classes.welcome_message_header}>
                  Hi {fullName ? fullName.split(" ")[0] : "Admin"}, welcome back
                  to admin dashboard area.
                </h2>

                <p
                  className={classes.welcome_message}
                >{`Here's the overview of the system.`}</p>
              </div>

              <DigitalClock />
            </div>
          )}
        </Card>

        <div
          className={`${classes.card__wrapper} ${classes.system_overview_card}`}
        >
          {loading ? (
            <SystemOverviewSkeleton />
          ) : (
            <section>
              {/* {
                <p
                  className={classes.heading}
                >{`Hi ${userName}, Welcome to Admin Dashboard Area`}</p>
              } */}
              {/* <h2 className={classes.sub__title}>System Overview</h2> */}

              <div className={classes.flexbox_container}>
                <div className={classes.card__box__container}>
                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Index Number :</p>
                        <p className={`${classes.amount}`}>{studentId}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__red}`}>
                      <NumberIcon />
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>{`Full Name :`}</p>
                        <p className={`${classes.amount}`}>
                          {fullName ? formatName(fullName) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__violet}`}>
                      <StudentIcon />
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Phone :</p>
                        <p className={classes.amount}>{contact}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__green}`}>
                      <TelephoneIcon />
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Programme :</p>
                        <p className={classes.amount}>{programme}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__blue}`}>
                      <ProgrammeIcon />
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>School Name :</p>
                        <p className={classes.amount}>{schoolName}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__yellow}`}>
                      <SchoolIcon />
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>District :</p>

                        <p className={` ${classes.amount}`}>{district}</p>
                      </div>
                    </div>

                    <div
                      className={`${classes.icon} ${classes.icon__lightblue}`}
                    >
                      <WorkPlaceIcon />
                    </div>
                  </Card>
                </div>

                {/*========== Custom calendar ==============*/}
                <div className={classes.calendar_container}>
                  <CustomCalendar />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ======sales report table======= */}
        {/* <div className="sales_table">
          {loading ? (
            <TableSkeleton />
          ) : (
            <SalesHistoryPT
              columns={columns}
              rows={rows}
              onChangeDate={onChangeDateHandler}
              amount={currencyFormatter(
                +filteredItemAmount,
                currency
              ).toString()}
              onChange={onChangeHandler}
            />
          )}
        </div> */}

        <Footer />
      </div>
    </Fragment>
  );
};
AdminDashboard.propTypes = {
  closeLoader: PropTypes.func,
};
export default AdminDashboard;
