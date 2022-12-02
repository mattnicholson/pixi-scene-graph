import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

function initFilter(props) {
	let f;
	switch (props.type) {
		case "displacement":
			let sprite = props.sprite || new PIXI.Sprite();
			let scale = props.scale || 50;
			f = new PIXI.filters.DisplacementFilter(sprite);
			f.scale.set(scale);
			return f;
			break;
		case "noise":
			let noise = props.noise || 0.5;
			let seed = props.seed || undefined;
			f = new PIXI.filters.NoiseFilter(noise, seed);
			return f;
			break;
		case "blur":
			let strength = props.strength || 8;
			let quality = props.quality || 10;
			let resolution = props.resolution || 2;
			let kernelSize = props.kernelSize || 11;

			f = new PIXI.filters.BlurFilter(
				strength,
				quality,
				resolution,
				kernelSize
			);

			return f;
			break;
	}
}

function PixiFilter(props, ref) {
	const [mounted, setMounted] = useState(false);

	const _ref = useRef();

	useImperativeHandle(ref, () => {
		return _ref.current;
	});

	useMount(() => {
		let f = initFilter(props);
		_ref.current = f;
		props.root.filters.push(f);

		setMounted(true);
	});

	useUnmount(() => {});

	useEffect(() => {
		//_ref.current = initFilter(props);
	}, [props.sprite, props.scale]);

	return <></>;
}

const Filter = withPixiApp(React.forwardRef(PixiFilter));

export { Filter };
