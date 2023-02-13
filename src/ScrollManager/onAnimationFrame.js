const onAnimationFrame = (fn) => {
	let loopId;

	let stop = function () {
		if (loopId) {
			window.cancelAnimationFrame(loopId);
		}
	};

	let controller;

	let loop = function () {
		loopId = window.requestAnimationFrame(loop);

		controller = { id: loopId, stop: stop };
		fn(controller);
	};

	loop();

	// Return function that destroys the listener
	return [controller, stop];
};

export default onAnimationFrame;
