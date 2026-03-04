import { Fragment, Suspense } from "react";
import classes from "./page.module.css";
import Link from "next/link";
import { MealsGrid } from "@/components/meals/meals-grid";
import { getAllMeals } from "@/lib/meals";

export const metadata = {
  title: "All Meals - NextLevel Food",
  description: "Browse the delicious meals shared by our community of food lovers.",
};

async function Meals() {
  const meals = await getAllMeals();
  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>
          Delicious meals, created <span className={classes.highlight}>by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself!, It is easy and fun!</p>
        <p className={classes.cta}>
          <Link href='/meals/share'>Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<p className={classes.loading}>Loading meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </Fragment>
  );
}
