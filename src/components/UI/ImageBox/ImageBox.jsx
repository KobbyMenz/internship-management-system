// import { Avatar } from "@mui/material";
//import classes from "./ImageBox.module.css";

import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
//import { useMemo } from "react";
//import DefaultImage from "../../../assets/images/line-md--image-twotone.png"; // Default image if src is not provided

const ImageBox = ({
  src,
  alt,
  width,
  height,
  borderRadius,
  background,
  border,
}) => {
  return (
    <Avatar
      // className={classes.img}
      alt={alt || "avatar"}
      src={src}
      sx={{
        width: width || "6rem",
        height: height || "7rem",
        objectFit: "cover",
        border: border || "none",
        borderRadius: borderRadius || " 0.5rem",
        background: background || "var(--bg-color2)",
        boxShadow: "0 0.2rem 0.8rem rgba(0, 0, 0, 0.192)",
      }}
    />
  );
};
ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  background: PropTypes.string,
  border: PropTypes.string,
};
export default ImageBox;
