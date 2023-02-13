import onAnimationFrame from "./onAnimationFrame";

class ScrollManager {
	// Defaults
	defaults = {
		global: true, // Is this ScrollManager api available to the window?
		precision: 1000, // Resolution of progress values. Higher values will mean more renders and greater detail
	};
	settings = {};

	// Array of items being tracked for progress & visibility
	elements = []; // [{ref:<html element>,in:0.2,out:0.3,state:{isVisible,isCustomVisible ...},customIn:0.1,customOut:0.5,offsets, props: {customSettings,onProgress,onVisible,onInvisible}}] (calculates the in and out marker for each element)

	ticker = null;
	tickCallbacks = [];

	listeners = []; // [{type:'label',callback:()=>{}}]
	on = (label, callback) => {
		let len = this.listeners.push({ type: label, callback: callback });
		let key = len - 1;

		return key;
	};
	trigger = (label, payload) => {
		this.listeners
			.filter((l) => l.type === label)
			.forEach((l) => {
				let callback = l.callback;
				callback(payload, this.state);
			});
	};
	removeListener = (key) => {
		this.listeners.splice(key, 1);
	};

	// Main calaculations
	state = {
		travelled: 0,
		distance: 0,
		progress: -1,
		direction: null, // UP or DOWN
	};
	// For per-element comparison
	prevState = {};

	constructor() {
		if (!global.SCROLLMANAGER) {
			global.SCROLLMANAGER = this;
		}
	}
	start = (props) => {
		this.settings = { ...this.defaults, ...props };

		// Override global if settings.global
		if (this.settings.global) {
			global.SCROLLMANAGER = this;
		}

		// Start
		setTimeout(() => {
			// Calculate layout offsets
			this.calculateOffsets();

			// Start listening
			this.listen();
		}, 50);
	};
	listen = () => {
		// Returns [controller,stop];
		const ticker = onAnimationFrame(this.loop);

		// Store a ticker.stop() in the class
		this.ticker = {
			add: this.addTick,
			stop: ticker[1],
		};
	};

	addTickCallback = (fn) => {
		let len = this.tickCallbacks.push(fn);
		let key = len - 1;

		return key;
	};
	removeTickCallback = (key) => {
		this.tickCallbacks.splice(key, 1);
	};
	loop = () => {
		let newState = this.calculateScroll();

		if (newState.progress !== this.state.progress) {
			// Store previous
			this.prevState = { ...this.state };
			// Update main state
			this.state = { ...newState };
			// Main progress...
			this.onProgress();
		}

		// Callbacks
		if (this.tickCallbacks.length) {
			this.tickCallbacks.forEach((fn) => {
				fn(this.state, this.prevState);
			});
		}
	};
	onProgress = () => {
		let progressIs = this.state.progress;
		let progressWas = this.prevState.progress;

		this.elements.forEach((el) => {
			let defaultViewportProgress = {
				progress: {
					is: progressIs,
					was: progressWas,
				},
				waypoints: {
					in: el.in,
					out: el.out,
				},
				callbackObject: el,
				callbackLabel: "",
			};

			this.runProgressCallbacks(defaultViewportProgress);

			// Is active — different to visible,
			// describes when the element is meaningfully visible
			// rather than technically visible

			// Custom values
			if (el.customSettings) {
				let customViewportProgress = {
					progress: {
						is: progressIs,
						was: progressWas,
					},
					waypoints: {
						in: el.customIn,
						out: el.customOut,
					},
					callbackObject: el,
					callbackLabel: "Custom",
				};

				this.runProgressCallbacks(customViewportProgress);
			}
		});
	};
	runProgressCallbacks = ({
		progress,
		waypoints,
		callbackObject,
		callbackLabel = "",
	}) => {
		/*
			{
				progress : {is,was}
				waypoints : {in,out}
				callbackLabel : '' // will be interpolated eg on${Custom}Progress where label = 'Custom'
				callbackObject : the current iteration of this.elements
			}	
		*/

		let elProgressIs = this.roundProgress(
			rangeProgress([waypoints.in, waypoints.out], progress.is)
		);
		let elProgressWas = this.roundProgress(
			rangeProgress([waypoints.in, waypoints.out], progress.was)
		);

		// Is visible?
		//let wasVisible = elProgressWas >= 0 && elProgressWas <= 1;
		let wasVisible = callbackObject.state[`is${callbackLabel}Visible`];
		let isVisible = elProgressIs >= 0 && elProgressIs <= 1;

		let visibilityChanged = isVisible !== wasVisible;

		// Update the state to current visibility
		callbackObject.state[`is${callbackLabel}Visible`] = isVisible;

		let lastLogged = callbackObject.state[`last${callbackLabel}Progress`];
		let scrolldata = {
			ref: callbackObject.ref,
			progress: elProgressIs,
			travelled: Math.round(callbackObject.distance * elProgressIs),
		};

		// Sometimes the request animation frame fires when the item is now no longer visible
		// Needs to trigger the final out of bounds progress call so that progres handlers can deal with a true final value
		let needsFinalProgressCall = lastLogged >= 0 && lastLogged <= 1;

		//console.log(scrolldata);

		if (visibilityChanged) {
			if (isVisible) {
				if (callbackObject[`on${callbackLabel}Visible`])
					callbackObject[`on${callbackLabel}Visible`](scrolldata);
			}
			if (wasVisible) {
				if (callbackObject[`on${callbackLabel}Invisible`])
					callbackObject[`on${callbackLabel}Invisible`](scrolldata);
			}
		}

		if (isVisible || needsFinalProgressCall) {
			// Store last progress value
			callbackObject.state[`last${callbackLabel}Progress`] = elProgressIs;
			if (callbackObject[`on${callbackLabel}Progress`])
				callbackObject[`on${callbackLabel}Progress`](scrolldata);
		}
	};
	calculateScroll = () => {
		let scrollTravelled = this.getCurrentScrollPosition();
		let scrollDistance = this.getCurrentScrollDistance();
		let scrollProgress = this.roundProgress(
			rangeProgress([0, 1], scrollTravelled / scrollDistance)
		);

		// Clamp between 0 and 1
		if (scrollProgress < 0) scrollProgress = 0;
		if (scrollProgress > 1) scrollProgress = 1;

		let scrollDirection =
			this.state.travelled < scrollTravelled ? "DOWN" : "UP";

		return {
			distance: scrollDistance,
			travelled: scrollTravelled,
			progress: scrollProgress,
			direction: scrollDirection,
		};
	};
	getCurrentScrollPosition = () => {
		// TODO: Connect with settings to allow different scroll reference
		return window.scrollY;
	};
	getCurrentScrollDistance = () => {
		// TODO: Connect with settings to allow different scroll reference
		return (
			this.getCurrentScrollHeight() - this.getCurrentScrollFrameHeight()
		);
	};
	getCurrentScrollHeight = () => {
		// TODO: Connect with settings to allow different scroll reference
		return document.body.scrollHeight;
	};
	getCurrentScrollFrameHeight = () => {
		// TODO: Connect with settings to allow different scroll reference
		return window.innerHeight;
	};
	getCurrentScrollFrameWidth = () => {
		// TODO: Connect with settings to allow different scroll reference
		return window.innerWidth;
	};
	roundProgress = (rawProgress) => {
		return (
			Math.round(rawProgress * this.settings.precision) /
			this.settings.precision
		);
	};
	calculateOffsets = () => {
		this.elements.forEach((el) => {
			// Will change based on scroll
			let bounding = el.ref.getBoundingClientRect();

			let top = bounding.y + this.getCurrentScrollPosition();
			let height = bounding.height;

			let inPos = top - this.getCurrentScrollFrameHeight();
			let outPos = top + height;

			let inProg = inPos / this.getCurrentScrollDistance();
			let outProg = outPos / this.getCurrentScrollDistance();

			inProg = this.roundProgress(inProg);
			outProg = this.roundProgress(outProg);

			let key = this.elements.indexOf(el);

			this.elements[key].state = {
				isVisible: null,
				isCustomVisible: null,
			};
			this.elements[key].in = inProg;
			this.elements[key].out = outProg;
			this.elements[key].distance = height;
			this.elements[key].offsets = {
				top: top,
				height: height,
			};

			if (el.customSettings) {
				let customValues = this.calculateCustomOffsets({
					ref: el.ref,
					bounding: bounding,
					props: el.customSettings,
				});

				this.elements[key].customIn = customValues.in;
				this.elements[key].customOut = customValues.out;
				this.elements[key].customDistance = customValues.distance;
			} else {
				// No custom settings, match the default
				this.elements[key].customIn = inProg;
				this.elements[key].customOut = outProg;
			}
		});
	};
	calculateCustomOffsets = ({ ref, bounding, props }) => {
		let viewPortHeight = this.getCurrentScrollFrameHeight();
		let viewPortWidth = this.getCurrentScrollFrameWidth();
		let viewPortDist = !props.horizontal ? viewPortHeight : viewPortWidth;

		let curPos = bounding;

		let h = Math.abs(curPos.top - curPos.bottom);
		let w = Math.abs(curPos.left - curPos.right);

		// Position in viewport
		let pos = !props.horizontal ? curPos.top : curPos.left;

		let size = !props.horizontal ? h : w;

		// Absolute start point —
		// if this doesn't change it is equivalent to
		// starting when the element hits the bottom of the viewport
		let inPos =
			pos +
			this.getCurrentScrollPosition() -
			this.getCurrentScrollFrameHeight();

		if (props.hasOwnProperty("start")) {
			// Make relative to top of the frame
			inPos += this.getCurrentScrollFrameHeight();
			// Add the start value
			inPos -= props.start;
		}

		// How far to travel - default to the viewport plus the height of the object
		let dist = props.distance ? props.distance : size;

		let outPos = inPos + dist;

		let inProg = inPos / this.getCurrentScrollDistance();
		let outProg = outPos / this.getCurrentScrollDistance();

		return {
			in: inProg,
			out: outProg,
			distance: dist,
		};
	};
	destroy = () => {
		// Called when unmounting to unset listeners etc
		this.ticker.stop();
	};
	addElement = (props) => {
		// Add an element to the array of items
		// that will have waypoints set
		// when layout is calculated
		let len = this.elements.push(props);
		return len - 1;
	};
	removeElement = (key) => {
		// Remove an element from the array
		this.elements.splice(key, 1);
	};
}

const api = new ScrollManager();

function clamp(value) {
	let v = value;
	if (v < 0) v = 0;
	if (v > 1) v = 1;

	return v;
}

// Clamp a number between range [start,end] ragardless of overall progress
// For example, as progress runs from 0 to 1
// We want a second progress value returned between 0 and 1 when the progress moves through the range [start,end]
// eg When progress is between 0.3 and 0.5, convert is value through that range to a number from 1 to 0

function rangeProgress(range, progress) {
	let start = range[0];
	let end = range[1];

	let metaProgress = (progress - start) / (end - start);

	return metaProgress;
}

// Different to rangeProgress, this will map the progress to a new range
// The range will always be between range [start,end], depending on the progress value
// eg we want to scale something between 0.2 and 5 when the progress is 0 and 1 respectively
function progressMap(range, progress) {
	let start = range[0];
	let end = range[1];

	let dist = end - start;
	let amt = dist * progress;

	return start + amt;
}

export default api;
