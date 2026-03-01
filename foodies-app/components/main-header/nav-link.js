"use client";
import Link from "next/link";
import classes from "./nav-link.module.css";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, children }) => {
  const currentPath = usePathname();
  return (
    <Link href={href} className={currentPath === href ? `${classes.link} ${classes.active}` : classes.link}>
      {children}
    </Link>
  );
};
