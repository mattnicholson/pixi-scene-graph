import React, { useRef, useState, useEffect } from "react";
import * as PIXI from "pixi.js";

import { AppProvider } from "./provider";
import { useMount } from "react-use";
import { If } from "../utils/If.js";

const alpha = "/pixel.png";
const pixel = "/pixel-solid.png";

const Stage = (props) => {
	const [mounted, setMounted] = useState(false);
	const el = useRef(null);
	const bg = useRef(null);

	const appRef = useRef(null);
	const apiRef = useRef(null);

	const comps = useRef({});

	const root = useRef(null);
	const hasInit = useRef(null);

	const SOLID_texture = PIXI.Texture.from(pixel);
	const ALPHA_texture = PIXI.Texture.from(alpha);

	useMount(() => {
		// Set up a pixi app
		const app = new PIXI.Application({
			width: 1080,
			height: 1080,
			backgroundAlpha: 0,
		});
		// Add it to the div
		el.current.appendChild(app.view);
		// Create a background

		// Set up a background area for rendering all pixel data at canvas size
		const BG = new PIXI.Container();
		app.stage.addChild(BG);

		const px = new PIXI.Sprite(props.debug ? SOLID_texture : ALPHA_texture);
		px.width = 1080;
		px.height = 1080;
		px.tint = 0xff0000;

		// Store the ref to the bg
		bg.current = px;

		// Create a mask that fits the bounds of the app so that contents don't go outside the frame
		const pxMask = new PIXI.Sprite(SOLID_texture);
		pxMask.width = 1080;
		pxMask.height = 1080;
		BG.mask = pxMask;

		BG.id = "__root";
		BG.addChild(px);
		BG.addChild(pxMask);

		// Set the root to be this BG container, so everything gets masked
		root.current = BG;

		// Store the app
		appRef.current = app;

		// Store a window ref too
		window.__app = app;
		window.__root = BG;

		const api = {
			downloadFrame: () => {
				(async () => {
					const dataUri = await app.renderer.extract.base64(
						app.stage,
						"image/png"
					);

					let link = document.createElement("a");
					link.href = dataUri;
					link.download = `${Date.now()}.png`;
					link.innerHTML = "Download";
					link.id = "download";

					link.click();
				})();
			},
			setComp: (key, value) => {
				comps.current[key] = value;
			},
			getComp: (key) => {
				return comps.current[key];
			},
		};

		// Store the api in context
		apiRef.current = api;

		if (props.onInit) {
			props.onInit(api);
		}

		// Update the state to render the children
		setMounted(true);
	});

	// Allow props to alter debug background after mount
	useEffect(() => {
		if (props.debug) {
			bg.current.texture = SOLID_texture;
		} else {
			bg.current.texture = ALPHA_texture;
		}
	}, [props.debug]);

	return (
		<div ref={el}>
			<If cond={mounted}>
				<AppProvider
					value={{
						app: appRef.current,
						root: root.current,
						api: apiRef.current,
					}}
				>
					{props.children}
				</AppProvider>
			</If>
		</div>
	);
};

export { Stage };
