import React, { Component } from "react";

import RenderLoop from "./RenderLoop";

/*
	
	Provide a callback when an item is x% up the viewport

*/

class ViewportProgress extends Component {
	progress = 0;
	els = { marker: false };
	constructor(props) {
		super(props);
		this.state = {
			stat: 0,
			pos: 0,
			progress: 0,
			height: 0,
			width: 0,
			distance: 0,
		};
	}

	componentDidMount = () => {};

	onFrame = () => {
		if (!this.els.marker) return;

		let viewPortHeight = window.innerHeight;
		let viewPortWidth = window.innerWidth;
		let viewPortDist = !this.props.horizontal
			? viewPortHeight
			: viewPortWidth;

		let curPos = this.els.marker
			? this.els.marker.getBoundingClientRect()
			: 0;

		let h = Math.abs(curPos.top - curPos.bottom);
		let w = Math.abs(curPos.left - curPos.right);

		// Position in viewport
		let pos = !this.props.horizontal ? curPos.top : curPos.left;

		// How far to travel - default to the viewport plus the height of the object
		let dist = this.props.distance ? this.props.distance : viewPortDist;

		// Add the item height to the distance
		if (!this.props.horizontal) {
			dist = this.props.hasOwnProperty("ignoreHeight") ? dist : dist + h;
		} else {
			dist = this.props.hasOwnProperty("ignoreWidth") ? dist : dist + w;
		}
		// Use the objects size as the distance
		if (!this.props.horizontal) {
			if (this.props.useHeight) dist = h;
		} else {
			if (this.props.useWidth) dist = w;
		}

		// Add the viewport to the distance
		dist = this.props.hasOwnProperty("ignoreViewport")
			? dist - viewPortDist
			: dist;

		// How much to delay the progress start
		let delayPx = this.props.delay ? this.props.delay : 0;

		// When to start the progress
		let start = this.props.hasOwnProperty("start")
			? this.props.start
			: viewPortDist;

		// Minimum allowed progress
		let minProgress = this.props.hasOwnProperty("minProgress")
			? this.props.minProgress
			: 0;

		// Maximum allowed progress
		let maxProgress = this.props.hasOwnProperty("maxProgress")
			? this.props.maxProgress
			: 1;

		// How far has it travelled?
		let travelled = start - pos - delayPx;

		let progress = travelled / dist;
		// Scale it up and back again to avoid floating point issues
		progress = Math.round(progress * 100) / 100;

		if (this.props.reverse) progress = 1 - progress;

		let capProgress = this.props.hasOwnProperty("capProgress")
			? this.props.capProgress
			: 1;
		if (capProgress) {
			if (progress > maxProgress) progress = maxProgress;
			if (progress < minProgress) progress = minProgress;
		}

		if (progress == this.progress) return;

		this.progress = progress;

		if (this.props.debug) {
			this.setState({
				start: start,
				travelled: travelled,
				distance: dist,
				progress: progress,
				height: h,
				width: w,
				pos: pos,
			});
		}

		if (this.props.onProgress)
			this.props.onProgress({ progress, pos, travelled, dist });
	};
	render() {
		let _this = this;
		let debug;

		if (this.props.debug) {
			debug = [
				<div data-layout-head>
					<div
						style={{
							background: "rgba(0,0,0,0.5)",
							color: "white",
							padding: "5px",
							fontSize: "12px",
							fontFamily: "monospace",
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							zIndex: 5,
						}}
					>
						Start: {_this.state.start}
						<br />
						Pos: {_this.state.pos}
						<br />
						Travelled:{_this.state.travelled}
						<br />
						Distance to cover:{_this.state.distance}
						<br />
						Progress:{_this.state.progress}
						<br />
					</div>
				</div>,
				<div data-layout-foot>
					<div
						style={{
							background: "rgba(0,0,0,0.5)",
							color: "white",
							padding: "5px",
							fontSize: "12px",
							fontFamily: "monospace",
							position: "fixed",
							zIndex: 5,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					>
						Start: {_this.state.start}
						<br />
						Pos: {_this.state.pos}
						<br />
						Travelled:{_this.state.travelled}
						<br />
						Distance to cover:{_this.state.distance}
						<br />
						Progress:{_this.state.progress}
						<br />
					</div>
				</div>,
				<div
					data-layout-fluid
					style={{
						background: "red",
						opacity: _this.state.progress,
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 2,
					}}
				/>,
			];
		}
		return (
			<RenderLoop onFrame={this.onFrame}>
				<div
					data-progress-marker
					ref={(el) => {
						if (!_this.els.marker) {
							_this.els.marker = el;
						}
					}}
					style={null}
					className={this.props.className || null}
				>
					{debug}

					{this.props.children}
				</div>
			</RenderLoop>
		);
	}
}

export default ViewportProgress;
