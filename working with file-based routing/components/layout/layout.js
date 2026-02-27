import { Fragment } from "react";
import { MainHeader } from "./main-header";

export const Layout = ({ children }) => {
  return (
    <Fragment>
      <MainHeader />
      <main>{children}</main>
    </Fragment>
  );
};
