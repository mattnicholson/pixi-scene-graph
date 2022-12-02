import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

import { Container, ContainerChildren } from "./Container";

// Manually add other blend modes as filters eg shaders:
// https://godotshaders.com/snippet/blending-modes/

// Or off screen canvas blending 2 precomposed layers?

function PixiPreCompose(props, ref) {
	const [mounted, setMounted] = useState(false);
	const _ref = useRef();
	const interval = useRef();

	useImperativeHandle(ref, () => {
		return _ref.current;
	});

	useMount(() => {
		// Precomposed layers are hidden
		_ref.current.visible = false;
		captureComposition();
		setMounted(true);
	});

	useUnmount(() => {
		clearInterval(interval.current);
	});

	function captureComposition() {
		const renderer = props.app.renderer;

		// TODO: Match this to the container size or the stage size
		const renderTexture = PIXI.RenderTexture.create({
			width: 1080,
			height: 1080,
			resolution: 2,
			//multisample: PIXI.MSAA_QUALITY.LOW,
		});

		let texture = renderTexture;
		props.api.setComp(props.name, texture);

		// TODO: Re-render intelligently when nested assets are loaded
		interval.current = setInterval(() => {
			if (!_ref.current) return;
			_ref.current.visible = true;
			renderer.render(_ref.current, { renderTexture });
			_ref.current.visible = false;
		}, 500);
	}

	return (
		<Container ref={_ref}>
			<If cond={mounted}>
				<ContainerChildren root={_ref.current}>
					{props.children}
				</ContainerChildren>
			</If>
		</Container>
	);
}

const PreCompose = withPixiApp(React.forwardRef(PixiPreCompose));

export { PreCompose };
