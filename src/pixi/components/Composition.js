import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

import { Sprite } from "./Sprite";

function PixiComposition(props, ref) {
	const [mounted, setMounted] = useState(false);
	const _ref = useRef();
	const texture = useRef();

	useImperativeHandle(ref, () => {
		return _ref.current;
	});

	useMount(() => {
		texture.current = getComposition();

		// Get texture...
		/*let s = new PIXI.Sprite(texture.current);
		s.scale.set(props.scale);
		s.tint = props.tint;
		props.root.addChild(s);*/

		setMounted(true);
	});

	useUnmount(() => {});

	function getComposition() {
		let texture = props.api.getComp(props.from);

		return texture;
	}

	return (
		<>
			<If cond={mounted}>
				<Sprite {...props} ref={ref} texture={texture.current} />
			</If>
		</>
	);
}

const Composition = withPixiApp(React.forwardRef(PixiComposition));

export { Composition };
