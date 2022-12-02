import React from "react";
import { Upload } from "antd";

import { useCanvasImage } from "./useCanvasImage.js";

//const { Dragger } = Upload;

export const CanvasFileUploader = ({ onChange, children, ...rest }) => {
  const { getImage } = useCanvasImage();
  const handleBeforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target) {
        onChange(await getImage(e.target.result));
      }
    };
    reader.readAsDataURL(file);

    // Prevent upload
    return false;
  };
  return (
    <Upload
      {...rest}
      accept={".png,.jpeg,.jpg"}
      beforeUpload={handleBeforeUpload}
      onChange={() => {}}
    >
      {children}
    </Upload>
  );
};
