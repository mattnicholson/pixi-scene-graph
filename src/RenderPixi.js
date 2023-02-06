import * as PIXI from "pixi.js";

import { useEffect, useRef, useState } from "react";

import { useMount } from "react-use";

import { Stage } from "./pixi/stage/";
import { Sprite } from "./pixi/components/Sprite.js";
import { Container } from "./pixi/components/Container.js";

import { PreCompose } from "./pixi/components/PreCompose.js";
import { Composition } from "./pixi/components/Composition.js";

import { Filter } from "./pixi/filters/Filter.js";

function clamp(value) {
  let v = value;
  if (v < 0) v = 0;
  if (v > 1) v = 1;

  return v;
}

// Clamp a number between range [start,end] ragardless of overall progress
// For example, as progress runs from 0 to 1
// We want a second progress value retured between 0 and 1 when the progress moves through the range [satar,end]
// eg When progress is between 0.3 and 0.5, convert is value through that range to a number from 1 to 0
function rangeProgress(range, progress) {
  let start = range[0];
  let end = range[1];

  let metaProgress = (progress - start) / (end - start);

  return clamp(metaProgress);
}

// Different to rangeProgress, this will map the progress to a new range
// The range will always be between range [start,end], depending on the progress value
// eg we want to scale something between 0.2 and 5 when the progress is 0 and 1 respectively
function progressMap(range, progress) {
  let start = range[0];
  let end = range[1];

  let dist = end - start;
  let amt = dist * progress;

  return start + amt;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export const RenderPixi = ({ src, ...props }) => {
  const [hasDisplacement, setHasDisplacement] = useState(false);

  const ctxRef = useRef();
  const maskRef = useRef();

  const apiRef = useRef();
  const el = useRef();
  const pill = useRef();

  const displacement = useRef();
  const bubble = useRef();

  const blurRef = useRef();

  const shape1 = useRef();
  const shape2 = useRef();
  const shape3 = useRef();

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

      let scrollProgress =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);

      let scale1 = progressMap([0.5, 1], scrollProgress);
      let pos1 = progressMap([1080 * 0.75, 1080], scrollProgress);
      let scale2 = progressMap([0.8, 1.5], scrollProgress);
      let pos2 = progressMap([1080 * 0.25, 0], scrollProgress);
      let scale3 = progressMap([1, 1.5], scrollProgress);
      let pos3 = progressMap([1080 * 0.15, 1080 * -0.15], scrollProgress);

      /**/

      // TODO: Base this on the size of the mask vs size of the screen
      let longestSide = Math.max(window.innerHeight, window.innerWidth);
      let resolution = 1080 / longestSide;
      let maxMaskScale = 2 / resolution;
      //maxMaskScale = 2;
      let lerpAmt = 0.1;
      let scrollLerp = 0.2;

      shape1.current.x = lerp(shape1.current.x, pos1, lerpAmt);
      shape1.current.scale.y = shape1.current.scale.x = lerp(
        shape1.current.scale.x,
        scale1,
        lerpAmt
      );
      shape2.current.x = lerp(shape2.current.x, pos2, lerpAmt);
      shape2.current.scale.y = shape2.current.scale.x = lerp(
        shape2.current.scale.x,
        scale2,
        lerpAmt
      );
      shape3.current.x = lerp(shape3.current.x, pos3, lerpAmt);
      shape3.current.scale.y = shape3.current.scale.x = lerp(
        shape3.current.scale.x,
        scale3,
        lerpAmt
      );

      if (window.TRANSITION_DATA) {
        let scaleProgress = rangeProgress(
          [0.5, 1.2],
          window.TRANSITION_DATA.progress
        );

        //console.log(window.TRANSITION_DATA.progress, scaleProgress);

        if (maskRef.current) {
          let scale = 0.4 + maxMaskScale * scaleProgress;
          maskRef.current.scale.y = maskRef.current.scale.x = lerp(
            maskRef.current.scale.x,
            scale,
            scrollLerp
          );

          let movedProg =
            window.TRANSITION_DATA.travelled / (window.innerHeight * 0.75);
          let nudge = (1080 / 2) * movedProg;
          let setY = 1080 - nudge + maskRef.current.height / 2;

          // Lerp it
          maskRef.current.y = lerp(maskRef.current.y, setY, scrollLerp);

          if (window.TRANSITION_DATA.progress <= 0)
            maskRef.current.scale.set(0);

          if (window.TRANSITION_DATA.progress >= 0.99) {
            maskRef.current.scale.set(0);
            maskRef.current.y = 1080 * 2;
          }
        }
      }

      if (maskRef.current) {
        //maskRef.current.anchor.set(0.5);
        //maskRef.current.x = 1080 / 2;
        //maskRef.current.y = 1080 / 2;
        //maskRef.current.scale.set(1 + Math.sin(time * 0.002));
      }
      if (bubble.current) {
        //i++;
        //maskRef.current.anchor.set(0.5);

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
      <div ref={el}>
        <Stage
          debug={false}
          onInit={(api) => {
            apiRef.current = api;
          }}
        >
          {/*<PreCompose name="comp1">
            <Container>
              <Sprite image={"/shapes/shape-1.png"} />
              <Sprite mask image={"/pill-white.png"} />
            </Container>
          </PreCompose>*/}

          <Container>
            <Container>
              <Sprite
                width={1080}
                height={1080}
                image={"/pixel-solid.png"}
                tint={!props.mask ? 0xf4bfbf : 0x54b9f1}
              />

              <Sprite
                image={"/shapes/shape-1.png"}
                scale={0.8}
                anchor={0.5}
                x={1080 * 0.8}
                y={1080 * 0.3}
                tint={!props.mask ? 0x434562 : 0x4aabf8}
              />
              <Sprite
                scale={1}
                anchor={0.5}
                x={1080 * 0.8}
                y={1080 * 0.8}
                image={"/shapes/shape-2.png"}
                tint={!props.mask ? 0x6aa8e8 : 0x838a9f}
              />
              <Sprite
                scale={0.7}
                anchor={0.5}
                x={1080 * 0.2}
                y={1080 * 0.2}
                image={"/shapes/shape-3.png"}
                tint={!props.mask ? 0xc95835 : 0xaedaf6}
              />
              <Sprite
                scale={1}
                anchor={0.5}
                x={1080 * 0.9}
                y={1080 * 0.2}
                image={"/shapes/shape-4.png"}
                tint={!props.mask ? 0xf4bfbf : 0x69b9f4}
              />
              <Sprite
                scale={0.3}
                anchor={0.5}
                center
                image={"/shapes/shape-5.png"}
                tint={!props.mask ? 0x434562 : 0x3f4868}
                ref={shape3}
              />
              <Sprite
                scale={0.3}
                anchor={0.5}
                x={1080 * 0.5}
                y={1080 * 0.4}
                image={"/shapes/shape-6.png"}
                tint={!props.mask ? 0xffffff : 0xabdbf8}
                ref={shape2}
              />
              <Sprite
                scale={0.3}
                anchor={0.5}
                center
                image={"/shapes/shape-7.png"}
                tint={!props.mask ? 0xffffff : 0x3278b3}
                ref={shape1}
              />

              {/*<Composition  from="comp1" scale={1} />*/}
              {/*<Composition from="comp1" scale={0.5} tint={0x00ff00} />
              <Composition
                from="comp1"
                scale={0.2}
                tint={0xff0000}
                ref={(ref) => {
                  if (ref) {
                    // Ref callback will provide the PIXI.Sprite instance
                  }
                }}
              />*/}

              {/* (
                <Filter
                  type="blur"
                  strength={2}
                  quality={10}
                  resolution={2}
                  kernelSize={15}
                  ref={blurRef}
                />
              )

              {hasDisplacement && (
                <Filter
                  type="displacement"
                  scale={70}
                  sprite={displacement.current}
                />
              )}

              

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
              />*/}
            </Container>
            {/*
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
            <Sprite ref={maskRef} mask image={"/pill-white.png"} />*/}

            {props.mask && (
              <Sprite
                ref={maskRef}
                mask
                image={"/arch-white.png"}
                center
                scale={0.5}
                anchor={0.5}
              />
            )}

            <Filter type="noise" noise={0.1} seed={2} />
          </Container>
        </Stage>
      </div>
    </>
  );
};
