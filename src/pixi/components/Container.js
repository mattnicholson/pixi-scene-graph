import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.js";

// Manually add other blend modes as filters eg shaders:
// https://godotshaders.com/snippet/blending-modes/

// Or off screen canvas blending 2 precomposed layers?

const PixiContainerOld = withPixiApp((props, ref) => {
	console.log("ref for container", ref);

	const [mounted, setMounted] = useState(false);
	const containerRef = useRef();

	// Attach our container ref to the ref property
	useImperativeHandle(ref, () => containerRef.current);

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
		<>
			<If cond={mounted}>
				<ContainerChildren root={containerRef.current}>
					{props.children}
				</ContainerChildren>
			</If>
		</>
	);
});

const ContainerChildren = (props) => {
	var children = React.Children.map(props.children, (child, ix) => {
		if (!child) return null;
		// Update the root context for this element
		return React.cloneElement(child, {
			root: props.root,
			index: ix,
		});
	});

	return <>{children}</>;
};

function PixiContainer(props, ref) {
	const _ref = useRef(new PIXI.Container());
	const [mounted, setMounted] = useState(false);

	useImperativeHandle(ref, () => {
		return _ref.current;
	});

	useMount(() => {
		_ref.current.sortableChildren = true;
		if (props.root) props.root.addChild(_ref.current);
		setMounted(true);
	});

	useUnmount(() => {
		let c = _ref.current;

		c.children.forEach((child) => {
			c.removeChild(child);
		});
		if (c.parent) c.parent.removeChild(c);
		c.destroy({ children: true });
		_ref.current = null;
	});

	return (
		<>
			<If cond={mounted}>
				<ContainerChildren root={_ref.current}>
					{props.children}
				</ContainerChildren>
			</If>
		</>
	);
}

const Container = withPixiApp(React.forwardRef(PixiContainer));

export { Container, ContainerChildren };
