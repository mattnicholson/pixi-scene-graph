import React, { useRef, useState, useEffect } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

// Manually add other blend modes as filters eg shaders:
// https://godotshaders.com/snippet/blending-modes/

// Or off screen canvas blending 2 precomposed layers?

const Container = withPixiApp((props) => {
	const [mounted, setMounted] = useState(false);
	const containerRef = useRef();

	useMount(() => {
		let c = new PIXI.Container();
		props.root.addChild(c);
		containerRef.current = c;

		setMounted(true);
	});

	useUnmount(() => {
		let c = containerRef.current;
		c.children.forEach((child) => {
			c.removeChild(child);
		});
		c.parent.removeChild(c);
		containerRef.current = null;
	});

	return (
		<If cond={mounted}>
			<ContainerChildren root={containerRef.current}>
				{props.children}
			</ContainerChildren>
		</If>
	);
});

const ContainerChildren = (props) => {
	var children = React.Children.map(props.children, (child) => {
		if (!child) return null;
		// Update the root context for this element
		return React.cloneElement(child, {
			root: props.root,
		});
	});

	return <>{children}</>;
};

export { Container };
