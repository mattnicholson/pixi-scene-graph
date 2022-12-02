import * as PIXI from "pixi.js";

import { useEffect, useRef } from "react";
import { ColorMapFilter } from "@pixi/filter-color-map";
import { BlurFilter } from "@pixi/filter-blur";
import { AdjustmentFilter } from "@pixi/filter-adjustment";

import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

import { Stage } from "./pixi/stage/";
import { Sprite } from "./pixi/components/Sprite.js";
import { Container } from "./pixi/components/Container.js";

const preload = (src) =>
  new Promise(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });

const preloadAll = (sources) => Promise.all(sources.map(preload));

const alpha = "/pixel.png";
const pixel = "/pixel-solid.png";
const pill = "/pill-white.png";

const colorMap = new window.Image();
colorMap.crossOrigin = "anonymous";
colorMap.src = "/color-map-tint.png";

// Add to the loader
let manifest = [];
manifest.push(alpha);
manifest.push(pixel);
manifest.push(pill);
manifest.push(colorMap.src);

const filters = [];

const init = (props, wrapper) => {
  let assets = [...manifest, props.src];
  manifest.push(props.src);
  preloadAll(assets).then((loaded) => {
    let source = { width: 0, height: 0 };
    // Get the size of the uploaded file
    loaded.forEach((i) => {
      if (i.src === props.src) {
        source.width = i.width;
        source.height = i.height;
      }
    });

    const app = new PIXI.Application({
      width: 1080,
      height: 1080,
      backgroundAlpha: 0,
    });
    wrapper.appendChild(app.view);

    // 2x pixel textures for alpha and solid
    // Alpha forces a transparent pixel to be rendered
    // Solid allows us to to mask containers with a specific size

    const SOLID_texture = PIXI.Texture.from(pixel);
    const BG_texture = PIXI.Texture.from(alpha);

    // Set up a background area for rendering all pixel data at canvas size
    const BG = new PIXI.Container();
    app.stage.addChild(BG);

    const px = new PIXI.Sprite(BG_texture);
    px.width = 1080;
    px.height = 1080;
    px.tint = 0xff0000;

    const pxMask = new PIXI.Sprite(SOLID_texture);
    pxMask.width = 1080;
    pxMask.height = 1080;
    BG.mask = pxMask;

    BG.addChild(px);
    BG.addChild(pxMask);

    const container = new PIXI.Container();

    const Blur = new BlurFilter(0);
    const Adjustment = new AdjustmentFilter({ contrast: 1 });

    // Loop filters
    filters.push(Blur);
    filters.push(Adjustment);

    filters.forEach(() => {});

    BG.addChild(container);

    // Create a new texture
    const texture = PIXI.Texture.from(props.src);
    const image = new PIXI.Sprite(texture);
    image.anchor.set(0.5, 0.5);
    image.alpha = 0.9;

    let scale = 1060 / source.height;

    image.scale.set(scale);
    container.addChild(image);

    const pilltexture = PIXI.Texture.from(pill);

    const mask = new PIXI.Sprite(pilltexture);
    mask.anchor.set(0.5, 0.5);
    container.addChild(mask);
    container.mask = mask;

    // Move container to the center
    container.x = 1080 / 2;
    container.y = 1080 / 2;

    // Center image sprite in local container coordinates
    //container.pivot.x = container.width / 2;
    //container.pivot.y = container.height / 2;

    // Apply filters
    container.filters = [new ColorMapFilter(colorMap)];

    // Listen for animate update
    app.ticker.add((delta) => {
      // rotate the container!
      // use delta to create frame-independent transform
      //container.rotation -= 0.01 * delta;
    });

    setTimeout(function () {
      let i = new Image();
      i.onload = function () {
        // Call start
        (async () => {
          const dataUri = await app.renderer.extract.base64(
            app.stage,
            "image/png"
          );

          if (props.onRender) {
            props.onRender(dataUri);
          }
        })();
      };
      i.src = props.src;
    }, 5);
  });
};

const Pixi = (props) => {
  const el = useRef(null);
  const hasInit = useRef(null);

  useEffect(() => {
    if (el.current) {
      if (!hasInit.current) {
        hasInit.current = true;
        init(props, el.current);
      } else {
        // TODO - update, don't reredner
        el.current.innerHTML = "";
        init(props, el.current);
      }
    }
  }, [props]);

  return <div ref={el} />;
};

export const RenderImage = ({ src, ...rest }) => {
  const apiRef = useRef();

  return (
    <>
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
      </Stage>
    </>
  );
};

export const RenderImageOld = ({ src, ...rest }) => {
  return <Pixi src={src} {...rest} />;
};

export const RenderImageRaw = ({ src }) => {
  return <img alt="" width="100%" src={src} />;
};
