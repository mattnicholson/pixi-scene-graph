import { useState, useRef } from "react";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { CanvasFileUploader } from "./CanvasFileUploader.js";
import { RenderImage } from "./RenderImage.js";
import { If } from "./If.js";

import "antd/dist/reset.css";
import { FloatButton } from "antd";
import "./styles.css";

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
      <div id="drop">
        <CanvasFileUploader
          {...props}
          openFileDialogOnClick={false}
          onChange={(dataUrl) => {
            setImgUrl(dataUrl);
          }}
        >
          <div style={{ minHeight: `100vh`, background: `#EEEEEE` }}>
            <If cond={imgUrl || 1}>
              <div style={{ padding: "10vmax" }}>
                <div id="view" style={{ position: "relative" }}>
                  <RenderImage
                    src={imgUrl}
                    onRender={(downloadUrl) => {
                      let link = document.createElement("a");
                      link.href = downloadUrl;
                      link.download = `${Date.now()}.png`;
                      link.innerHTML = "Download";
                      link.id = "download";

                      donwloadLink.current = link;

                      setDownloadUrl(downloadUrl);
                    }}
                  />
                </div>
              </div>
            </If>
            <If cond={downloadUrl && 0}>
              <img
                style={{
                  border: "2px solid blue",
                  minHeight: "200px",
                  width: "100%",
                  display: "block",
                }}
                alt=""
                src={downloadUrl}
              />
            </If>
          </div>
        </CanvasFileUploader>
        <FloatButton.Group shape="circle" style={{ right: 24 }}>
          <If cond={downloadUrl}>
            <FloatButton
              onClick={() => donwloadLink.current.click()}
              icon={<SaveOutlined />}
            />
          </If>
          <CanvasFileUploader
            {...props}
            onChange={(dataUrl) => {
              setImgUrl(dataUrl);
            }}
          >
            <FloatButton icon={<UploadOutlined />} />
          </CanvasFileUploader>
        </FloatButton.Group>
      </div>
    </div>
  );
}
