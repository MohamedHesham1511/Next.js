import classes from "./error-alert.module.css";

export const ErrorAlert = (props) => {
  return <div className={classes.alert}>{props.children}</div>;
};
