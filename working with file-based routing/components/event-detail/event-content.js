import classes from "./event-content.module.css";

export const EventContent = (props) => {
  return <section className={classes.content}>{props.children}</section>;
};
