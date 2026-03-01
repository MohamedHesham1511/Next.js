import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import Image from "next/image";
import { Fragment } from "react";
import { MainHeaderBackground } from "@/components/main-header/main-header-background";

export const MainHeader = () => {
  return (
    <Fragment>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link href='/' className={classes.logo}>
          <Image src={logoImg} priority alt='A plate with food on it' />
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <Link href='/meals'>Browse Meals</Link>
            </li>
            <li>
              <Link href='/community'>Foodies Community</Link>
            </li>
          </ul>
        </nav>
      </header>
    </Fragment>
  );
};
