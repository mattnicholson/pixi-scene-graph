import { useState, useRef } from "react";
import { RenderImage } from "./RenderImage.js";
import ViewportProgress from "./ViewportProgress.js";
import { If } from "./If.js";

import "./styles.css";

import FPSStats from "react-fps-stats";

import ScrollManager, { ScrollElement } from "./ScrollManager";

import { useMount, useUnmount } from "react-use";

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

  const [stopScroll, setStop] = useState(false);

  return (
    <div className="App">
      <ScrollManager />
      <div className="Nav" />
      <div id="webgl_bg">
        <RenderImage mask={false} />
      </div>
      <div id="webgl_mask">
        <RenderImage mask={true} />
      </div>
      <FPSStats />
      {/*<ScrollElement
        // More intelligent visibilty state,
        // Based on scroll direction and amount of screen occupied by the element
        onActive={() => {
          console.log("blue active");
        }}
        onInactive={() => {
          console.log("blue inactive");
        }}
        onVisible={() => {
          console.log("blue visible");
        }}
        onInvisible={() => {
          console.log("blue invisible");
        }}
        onProgress={(scrolldata) => {
          //console.log(`blue ${scrolldata.progress}`);
        }}
        // Can pass in specific parameters for custom viewport progress control
        customSettings={{
          start: 0,
          ignoreHeight: true,
          //distance: window.innerHeight * 0.3,
        }}
        onCustomProgress={(scrolldata) => {
          //console.log(`blue custom ${scrolldata.progress}`);
          scrolldata.ref.style.opacity = (1 - scrolldata.progress).toFixed(2);
        }}
      >
        <div
          style={{
            position: "relative",

            background: "blue",
            height: "80vh",
          }}
        />
      </ScrollElement>

      <ScrollElement
        onVisible={() => {
          console.log("red visible");
        }}
        onInvisible={() => {
          console.log("red invisible");
        }}
        onProgress={(scrolldata) => {
          //console.log(`red ${scrolldata.progress}`);
        }}
        customSettings={{
          start: 0,
          //distance: window.innerHeight * 0.3,
        }}
        onCustomProgress={(scrolldata) => {
          //console.log(`red custom ${scrolldata.progress}`);
          scrolldata.ref.style.opacity = (1 - scrolldata.progress).toFixed(2);
        }}
       
      >
        <div
          style={{
            position: "relative",

            background: "red",
            height: "80vh",
          }}
        />
      </ScrollElement>*/}

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
          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>
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
          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>
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
          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>
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
          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>
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
          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>

          <p>Lorem ipsum dolor sit amet.</p>
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
