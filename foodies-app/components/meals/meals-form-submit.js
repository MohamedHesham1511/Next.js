"use client";
import { useFormStatus } from "react-dom";

export const MealsFormSubmit = () => {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Sharing..." : "Share Meal"}</button>;
};
