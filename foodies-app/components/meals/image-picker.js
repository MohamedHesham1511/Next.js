"use client";
import classes from "./image-picker.module.css";
import { useRef } from "react";

export const ImagePicker = ({ label, name }) => {
  const imageInput = useRef();

  const handlePickImage = () => {
    imageInput.current.click();
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <input ref={imageInput} type='file' id={name} name={name} accept='image/png, image/jpeg' className={classes.input} />
        <button type='button' onClick={handlePickImage} className={classes.button}>
          Pick an Image
        </button>
      </div>
    </div>
  );
};
