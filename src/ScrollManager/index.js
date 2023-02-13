import { useRef } from "react";
import { useMount, useUnmount } from "react-use";
import api from "./api.js";

export default function ScrollManager({ autoStart, ...props }) {
	useMount(() => {
		if (autoStart !== false) api.start(props);
	});

	useUnmount(() => {
		api.destroy();
	});

	return null;
}

// TODO - use Context for parent context, instead of always using global
export const ScrollElement = ({
	onInvisible,
	onVisible,
	onProgress,
	onTick,
	children,
	...rest
}) => {
	const el = useRef(null);
	const scrollRef = useRef(null);
	const tickRef = useRef(null);

	useMount(() => {
		scrollRef.current = global.SCROLLMANAGER.addElement({
			ref: el.current,
			onProgress: onProgress,
			onVisible: onVisible,
			onInvisible: onInvisible,
			...rest,
		});

		if (onTick) {
			tickRef.current = global.SCROLLMANAGER.addTickCallback(
				(state, prevState) => {
					onTick(state, prevState);
				}
			);
		}
	});

	useUnmount(() => {
		// Remove the element and the ticker process
		global.SCROLLMANAGER.removeElement(scrollRef.current);
		if (onTick) global.SCROLLMANAGER.removeTickCallback(tickRef.current);
	});

	return (
		<div id={rest.id} ref={el}>
			{children}
		</div>
	);
};
