import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import  { useState, useRef, useCallback, useEffect } from "react";

const CustomTooltip = styled(Tooltip)({
  // borderRadius: "2rem",
  // padding: "10px",
  // marginTop: "2rem",
});

const ToolTip = (props) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef();

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 5000);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <CustomTooltip
      title={<Typography sx={{ fontSize: "1.5rem",color:"#fff" }}>{props.title}</Typography>}
      placement={props.placement || "top"}
      arrow
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {props.children}
    </CustomTooltip>
  );
};

ToolTip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  placement: PropTypes.string,
};
export default ToolTip;
