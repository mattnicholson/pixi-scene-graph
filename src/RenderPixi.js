import * as PIXI from "pixi.js";

import { useEffect, useRef, useState } from "react";
import { ColorMapFilter } from "@pixi/filter-color-map";
import { BlurFilter } from "@pixi/filter-blur";
import { AdjustmentFilter } from "@pixi/filter-adjustment";

import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

import { useMount } from "react-use";

import { Stage } from "./pixi/stage/";
import { Sprite } from "./pixi/components/Sprite.js";
import { Container } from "./pixi/components/Container.js";

import { PreCompose } from "./pixi/components/PreCompose.js";
import { Composition } from "./pixi/components/Composition.js";

import { Filter } from "./pixi/filters/Filter.js";

export const RenderPixi = ({ src, ...rest }) => {
  const [hasDisplacement, setHasDisplacement] = useState(false);

  const ctxRef = useRef();
  const maskRef = useRef();

  const apiRef = useRef();
  const el = useRef();
  const pill = useRef();

  const displacement = useRef();
  const bubble = useRef();

  const blurRef = useRef();

  useMount(() => {
    let glCanvas = document.querySelector("#render canvas");

    if (blurRef.current) blurRef.current.blur = 50;
    /*el.current.addEventListener("mousemove", (ev) => {
      if (bubble.current) {
        blurRef.current.blur = (ev.offsetX / window.innerWidth) * 100;

        displacement.current.anchor.set(0.5);
        displacement.current.x = ev.offsetX;
        displacement.current.y = ev.offsetY;

        bubble.current.anchor.set(0.5);
        //bubble.current.x = ev.offsetX;
        //bubble.current.y = ev.offsetY;

        // Force to centre
        bubble.current.x = 1080 / 2;
        //bubble.current.y = 1080 / 2;

        displacement.current.x = 1080 / 2;
        displacement.current.y = 1080 / 2;

        //if (gl.canvas) {

        //}
      }
    });*/

    //let i = 0;
    const copyCanvas = (time) => {
      //console.log("render");
      requestAnimationFrame(copyCanvas);

      if (bubble.current) {
        //i++;
        //maskRef.current.anchor.set(0.5);
        maskRef.current.scale.set(1 + Math.sin(time * 0.004));

        bubble.current.anchor.set(0.5);
        bubble.current.x = 1080 / 2;
        bubble.current.y = 1080 / 2 + 100 * Math.sin(time * 0.004);

        displacement.current.anchor.set(0.5);
        displacement.current.x = 1080 / 2;
        displacement.current.y = 1080 / 2 + 100 * Math.sin(time * 0.004);

        //let ctx1 = ctxRef.current.getContext("2d");
        //ctx1.clearRect(0, 0, ctxRef.current.width, ctxRef.current.height);
        //ctx1.drawImage(apiRef.current.app.view, 0, 0);
      }
    };

    requestAnimationFrame(copyCanvas);
  });

  return (
    <>
      {/*<div className="ctx-wrapper">
        <canvas
          ref={ctxRef}
          className="ctx"
          id="ctx1"
          width="2160"
          height="2160"
        ></canvas>
      </div>*/}
      <div id="render" ref={el}>
        <FloatButton
          style={{ right: 94 }}
          onClick={() => apiRef.current.downloadFrame()}
          icon={<SaveOutlined />}
        />
        <Stage
          debug={false}
          onInit={(api) => {
            apiRef.current = api;
          }}
        >
          <PreCompose name="comp1">
            <Container>
              <Sprite
                width={1080}
                height={1080}
                image={"/pixel-solid.png"}
                tint={0xeec7ac}
              />
              {src && <Sprite image={src} />}
              <Sprite mask image={"/pill-white.png"} />
            </Container>
          </PreCompose>

          <Container>
            <Container>
              <Composition from="comp1" scale={1} tint={0xffe45b} />
              <Composition from="comp1" scale={0.5} tint={0x00ff00} />
              <Composition
                from="comp1"
                scale={0.2}
                tint={0xff0000}
                ref={(ref) => {
                  if (ref) {
                    // Ref callback will provide the PIXI.Sprite instance
                  }
                }}
              />

              {/* (
                <Filter
                  type="blur"
                  strength={2}
                  quality={10}
                  resolution={2}
                  kernelSize={15}
                  ref={blurRef}
                />
              )*/}

              {hasDisplacement && (
                <Filter
                  type="displacement"
                  scale={70}
                  sprite={displacement.current}
                />
              )}

              <Filter type="noise" noise={0.1} seed={2} />

              <Sprite
                width={500 * 0.625}
                height={500 * 0.625}
                ref={(ref) => {
                  if (ref) {
                    setHasDisplacement(true);
                    displacement.current = ref;
                  }
                }}
                id={"displacement"}
                image={"/bubbleDisplacement.png"}
              />
            </Container>
            <Sprite
              width={500}
              height={500}
              ref={(ref) => {
                if (ref) {
                  bubble.current = ref;
                }
              }}
              id={"sprite"}
              image={"/bubble256.png"}
            />
            <Sprite ref={maskRef} mask image={"/pill-white.png"} />
          </Container>
        </Stage>
      </div>
    </>
  );
};
