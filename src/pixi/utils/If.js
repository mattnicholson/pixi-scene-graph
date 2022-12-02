import React from "react";
import { withPixiApp } from "../stage/provider";

const If = React.forwardRef(({ cond, children }, ref) => {
	if (cond) {
		return <>{children}</>;
	}
	return null;
});

export { If };
