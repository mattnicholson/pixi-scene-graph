import { useState, useRef } from "react";
import { RenderImage } from "./RenderImage.js";
import ViewportProgress from "./ViewportProgress.js";
import { If } from "./If.js";

import "./styles.css";

import FPSStats from "react-fps-stats";

// Global transition object
window.TRANSITION_DATA = {
  travelled: 0,
  progress: 0,
  prev: {
    bg: "#FF0000",
  },
  next: {
    bg: "#0000FF",
  },
  current: {},
};

const props: UploadProps = {
  multiple: true,
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
  showUploadList: false,
};

export default function App() {
  const [imgUrl, setImgUrl] = useState(null);
  const titleRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  return (
    <div className="App">
      <div className="Nav" />
      <div id="viewa">
        <RenderImage mask={false} />
      </div>
      <div id="viewb">
        <RenderImage mask={true} />
      </div>
      <FPSStats />
      <div
        style={{
          position: "relative",
          zIndex: 5,

          paddingBottom: "10vh",
        }}
      >
        <ViewportProgress
          start={0}
          ignoreHeight={true}
          distance={window.innerHeight * 0.3}
          onProgress={({ progress, travelled }) => {
            if (titleRef.current) {
              titleRef.current.style.opacity = 1 - progress;
              titleRef.current.style.transform = `scale(${
                1 - 0 * progress
              }) translate(-50%,-${50 - 5 * progress}%)`;
            }
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100vh",
              fontSize: "20vmin",
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            <div ref={titleRef} className="Title">
              Under
              <br />
              One
              <br />
              Sky
            </div>
          </div>
        </ViewportProgress>
        <div
          style={{
            background: "#f6d055",
            width: "90%",
            margin: "0 auto",
            padding: "20px",
            "padding-bottom": "100vh",
            borderRadius: "40px",
            fontSize: "5vh",
            position: "relative",
            zIndex: 1,
            boxShadow: `2px 2px 0px rgba(0,0,0,0.2)`,
          }}
        >
          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>
        </div>
        <ViewportProgress
          //debug={true}
          ignoreHeight={true}
          //start={window.innerHeight * 0.5}
          distance={window.innerHeight * 2}
          onProgress={({ progress, travelled }) => {
            window.TRANSITION_DATA.progress = progress;
            window.TRANSITION_DATA.travelled = travelled;
            //console.log(progress);
          }}
        >
          <div
            style={{
              height: "200vh",

              width: "90%",
              margin: "0 auto",
              marginTop: "-100vh",
            }}
          />
        </ViewportProgress>
        <div
          style={{
            background: "#f6d055",
            width: "90%",
            margin: "0 auto",
            padding: "20px",
            "padding-bottom": "100vh",
            borderRadius: "40px",
            fontSize: "5vh",
          }}
        >
          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>
        </div>
        <ViewportProgress
          //debug={true}
          ignoreHeight={true}
          //start={window.innerHeight * 0.5}
          distance={window.innerHeight * 2}
          onProgress={({ progress, travelled }) => {
            window.TRANSITION_DATA.progress = progress;
            window.TRANSITION_DATA.travelled = travelled;
            //console.log(progress);
          }}
        >
          <div
            style={{
              height: "200vh",

              width: "90%",
              margin: "0 auto",
              marginTop: "-100vh",
            }}
          />
        </ViewportProgress>
        <div
          style={{
            background: "#f6d055",
            width: "90%",
            margin: "0 auto",
            padding: "20px",
            "padding-bottom": "100vh",
            borderRadius: "40px",
            fontSize: "5vh",
          }}
        >
          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>
        </div>
        <ViewportProgress
          //debug={true}
          ignoreHeight={true}
          //start={window.innerHeight * 0.5}
          distance={window.innerHeight * 2}
          onProgress={({ progress, travelled }) => {
            window.TRANSITION_DATA.progress = progress;
            window.TRANSITION_DATA.travelled = travelled;
            //console.log(progress);
          }}
        >
          <div
            style={{
              height: "200vh",

              width: "90%",
              margin: "0 auto",
              marginTop: "-100vh",
            }}
          />
        </ViewportProgress>
        <div
          style={{
            background: "#f6d055",
            width: "90%",
            margin: "0 auto",
            padding: "20px",
            "padding-bottom": "100vh",
            borderRadius: "40px",
            fontSize: "5vh",
          }}
        >
          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>
        </div>
        <ViewportProgress
          //debug={true}
          ignoreHeight={true}
          //start={window.innerHeight * 0.5}
          distance={window.innerHeight * 2}
          onProgress={({ progress, travelled }) => {
            window.TRANSITION_DATA.progress = progress;
            window.TRANSITION_DATA.travelled = travelled;
            //console.log(progress);
          }}
        >
          <div
            style={{
              height: "200vh",

              width: "90%",
              margin: "0 auto",
              marginTop: "-100vh",
            }}
          />
        </ViewportProgress>
        <div
          style={{
            background: "#f6d055",
            width: "90%",
            margin: "0 auto",
            padding: "20px",
            "padding-bottom": "100vh",
            borderRadius: "40px",
            fontSize: "5vh",
          }}
        >
          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>

          <p>Lorem ipsum dlor sit amet.</p>
        </div>
        <ViewportProgress
          //debug={true}
          ignoreHeight={true}
          //start={window.innerHeight * 0.5}
          distance={window.innerHeight * 2}
          onProgress={({ progress, travelled }) => {
            window.TRANSITION_DATA.progress = progress;
            window.TRANSITION_DATA.travelled = travelled;
            //console.log(progress);
          }}
        >
          <div
            style={{
              height: "200vh",

              width: "90%",
              margin: "0 auto",
              marginTop: "-100vh",
            }}
          />
        </ViewportProgress>
      </div>
    </div>
  );
}
