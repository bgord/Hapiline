import "./error.css";

import React from "react";
import {Margins, getMarginTokens} from "../design-system";

// prettier-ignore
export function Error({
	m, mx, my, mt, mr, mb, ml,
	...props
}: JSX.IntrinsicElements["div"] & Margins) {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	return <div className="c-error" {...marginTokens} {...props} />;
}
