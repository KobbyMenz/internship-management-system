import Card from "../UI/Card/Card";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <Card className={classes.footer}>
        Software by{" "}
        <span className={classes.span_container}>
          <span className={classes.span_1}>KOBBY-MENZ</span>{" "}
          <span className={classes.span_2}>Tech Solutions</span>
        </span>{" "}
        | copy right &copy; 2025. All right reserved.
      </Card>
    </>
  );
};
export default Footer;
