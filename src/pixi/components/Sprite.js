import React, { useRef, useState, useEffect } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

const pixel = "/pixel.png";

const Sprite = withPixiApp((props) => {
	const spriteRef = useRef();
	const [loaded, setLoaded] = useState(false);
	useMount(() => {
		let tex = props.image ? props.image : pixel;

		const texture = PIXI.Texture.from(tex);

		let s = new PIXI.Sprite(texture);

		props.root.addChild(s);
		spriteRef.current = s;

		let i = new Image();
		i.onload = function () {
			setLoaded(true);
		};
		i.src = tex;
	});
	// Unmount
	useUnmount(() => {
		let s = spriteRef.current;
		if (s && s.parent) {
			s.parent.removeChild(s);
			s.destroy({ children: true, texture: true });
		}
		spriteRef.current = null;
	});

	// Texture updating from image prop
	useEffect(() => {
		if (!loaded) return;
		const texture = props.image ? PIXI.Texture.from(props.image) : null;
		spriteRef.current.texture = texture;
	}, [loaded, props.image]);

	// Scale updater
	useEffect(() => {
		let scale = props.hasOwnProperty("scale") ? props.scale : 1;
		spriteRef.current.scale.set(scale);
	}, [props.scale]);

	// Width / height
	useEffect(() => {
		if (!loaded) return;
		if (props.hasOwnProperty("width"))
			spriteRef.current.width = props.width;
		if (props.hasOwnProperty("height"))
			spriteRef.current.height = props.width;
	}, [loaded, props.width, props.height]);

	// Tint
	useEffect(() => {
		spriteRef.current.tint = props.tint ? props.tint : 0xffffff;
	}, [props.tint]);

	// Mask
	useEffect(() => {
		if (!loaded) return;
		if (props.hasOwnProperty("mask")) {
			spriteRef.current.parent.mask = spriteRef.current;
		} else {
			if (spriteRef.current.parent.mask === spriteRef.current) {
				spriteRef.current.parent.mask = null;
			}
		}
	}, [loaded, props.mask]);

	return <></>;
});

export { Sprite };
