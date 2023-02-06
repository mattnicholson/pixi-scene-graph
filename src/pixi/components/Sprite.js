import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

const pixel = "/pixel.png";

function PixiSprite(props, ref) {
	const _ref = useRef();
	const [loaded, setLoaded] = useState(false);

	useImperativeHandle(ref, () => {
		return _ref.current;
	});

	useMount(() => {
		let texture;
		let tex = props.image ? props.image : pixel;

		if (!props.hasOwnProperty("texture")) {
			texture = PIXI.Texture.from(tex);
		} else {
			texture = props.texture;
		}

		let s = new PIXI.Sprite(texture);

		// Z index set initally based on node order, but can be set explicitly with zIndex prop
		s.zIndex = props.hasOwnProperty("index") ? props.index : 0;

		if (props.hasOwnProperty("zIndex")) {
			s.zIndex = props.zIndex;
		}

		if (props.hasOwnProperty("anchor")) {
			s.anchor.set(props.anchor);
		}

		if (props.hasOwnProperty("center")) {
			s.x = 1080 / 2;
			s.y = 1080 / 2;
		}

		if (props.hasOwnProperty("x")) {
			s.x = props.x;
		}

		if (props.hasOwnProperty("y")) {
			s.y = props.y;
		}

		props.root.addChild(s);
		_ref.current = s;

		let i = new Image();
		i.onload = function () {
			setLoaded(true);
		};
		i.src = tex;
	});
	// Unmount
	useUnmount(() => {
		let s = _ref.current;
		if (s && s.parent) {
			s.parent.removeChild(s);
			s.destroy({ children: true, texture: true });
		}
		_ref.current = null;
	});

	// Texture updating from image prop (and no texture ref specified)
	useEffect(() => {
		if (!loaded) return;
		if (props.hasOwnProperty("texture")) return;
		const texture = props.image ? PIXI.Texture.from(props.image) : null;
		_ref.current.texture = texture;
	}, [loaded, props.image]);

	// Scale updater
	useEffect(() => {
		let scale = props.hasOwnProperty("scale") ? props.scale : 1;
		_ref.current.scale.set(scale);
	}, [props.scale]);

	// Width / height
	useEffect(() => {
		if (!loaded) return;
		if (props.hasOwnProperty("width")) {
			_ref.current.width = props.width;
		}
		if (props.hasOwnProperty("height")) {
			_ref.current.height = props.height;
		}
	}, [loaded, props.width, props.height]);

	// Tint
	useEffect(() => {
		_ref.current.tint = props.tint ? props.tint : 0xffffff;
	}, [props.tint]);

	// zIndex
	useEffect(() => {
		if (props.hasOwnProperty("index")) {
			_ref.current.zIndex = props.index;
		}
		if (props.hasOwnProperty("zIndex")) {
			_ref.current.zIndex = props.zIndex;
		}
	}, [props.index, props.zIndex]);

	// Texture ref changed
	useEffect(() => {
		if (!loaded) return;
		_ref.current.texture = props.texture;
	}, [props.texture]);

	// Mask
	useEffect(() => {
		if (!loaded) return;
		if (props.hasOwnProperty("mask")) {
			_ref.current.parent.mask = _ref.current;
		} else {
			if (_ref.current.parent.mask === _ref.current) {
				_ref.current.parent.mask = null;
			}
		}
	}, [loaded, props.mask]);

	return <></>;
}

const Sprite = withPixiApp(React.forwardRef(PixiSprite));

export { Sprite };
