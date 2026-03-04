"use client";
import classes from "./image-picker.module.css";
import { useRef, useState } from "react";
import Image from "next/image";

export const ImagePicker = ({ label, name }) => {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();

  const handlePickImage = () => {
    imageInput.current.click();
  };

  const handleImageChange = (event) => {
    const pickedFile = event.target.files[0];

    if (!pickedFile) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(pickedFile);
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>Please pick an image.</p>}
          {pickedImage && <Image src={pickedImage} alt='Preview' fill />}
        </div>
        <input
          ref={imageInput}
          type='file'
          onChange={handleImageChange}
          id={name}
          name={name}
          accept='image/png, image/jpeg'
          className={classes.input}
          required
        />
        <button type='button' onClick={handlePickImage} className={classes.button}>
          Pick an Image
        </button>
      </div>
    </div>
  );
};
