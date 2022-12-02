import * as PIXI from "pixi.js";

import { useEffect, useRef } from "react";
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

export const RenderPixi = ({ src, ...rest }) => {
  const apiRef = useRef();
  const el = useRef();
  const pill = useRef();

  return (
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
          <Composition from="comp1" scale={1} tint={0xffe45b} />
          <Composition from="comp1" scale={0.5} tint={0x00ff00} />
          <Composition
            from="comp1"
            scale={0.2}
            tint={0xff0000}
            zIndex={10}
            ref={(ref) => {
              if (ref) {
                // Ref callback will provide the PIXI.Sprite instance
              }
            }}
          />

          <Sprite
            scale={0.7}
            tint={0xffff00}
            ref={(ref) => {
              if (ref) {
                ref.tint = 0x0000ff;
              }
            }}
            id={"sprite"}
            image={"/pill-white.png"}
          />
        </Container>
      </Stage>
    </div>
  );
};
