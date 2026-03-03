import sql from "better-sqlite3";

const db = sql("meals.db");

export const getAllMeals = async () => {
  const stmt = db.prepare("SELECT * FROM meals");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return stmt.all();
};
