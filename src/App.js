import { useState, useRef } from "react";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { CanvasFileUploader } from "./CanvasFileUploader.js";
import { RenderImage } from "./RenderImage.js";
import { If } from "./If.js";

import "antd/dist/reset.css";
import { FloatButton } from "antd";
import "./styles.css";

import FPSStats from "react-fps-stats";

const props: UploadProps = {
  multiple: true,
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
  showUploadList: false,
};

export default function App() {
  const [imgUrl, setImgUrl] = useState(null);
  const donwloadLink = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  return (
    <div className="App">
      <div id="viewa">
        <RenderImage mask={false} />
      </div>
      <div id="viewb">
        <RenderImage mask={true} />
      </div>
      <FPSStats />
      <div style={{ position: "relative", zIndex: 5 }}>
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
        <div
          style={{
            height: "50vw",
            background: "yellow",
            width: "70%",
            margin: "10vmax auto",
            borderRadius: "10%",
          }}
        />
      </div>
    </div>
  );
}
