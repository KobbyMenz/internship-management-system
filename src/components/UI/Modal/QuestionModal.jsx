import { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classes from "../Modal/Modal.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";
import QuestionIcon from "../Icons/QuestionIcon";

const QuestionModal = (props) => {
  const Backdrop = () => {
    return (
      <Fragment>
        (
        <div className={classes.backdrop} onClick={props.onCloseModal} />)
      </Fragment>
    );
  };

  const ModalOverlay = (props) => {
    return (
      <Fragment>
        (
        <Card className={classes.modal}>
          <header>Confirmation Message</header>
          <div className={classes.content}>
            <QuestionIcon />
            <p>Are you sure you want to logout?</p>
          </div>

          <div className={classes.btn_container}>
            <Button className={classes.btn} onClick={props.onConfirm}>
              Yes
            </Button>

            <Button
              type="button"
              id={classes.btn__no}
              onClick={props.onCloseModal}
            >
              No
            </Button>
          </div>
        </Card>
        )
      </Fragment>
    );
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
          onCloseModal={props.onCloseModal}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};

QuestionModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  // backdrop: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default QuestionModal;
