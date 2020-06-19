import "./error.css";

import React from "react";
import {Margins, getMarginTokens} from "../design-system";

// prettier-ignore
export const Error: React.FC<JSX.IntrinsicElements["div"] & Margins> = ({
	m, mx, my, mt, mr, mb, ml,
	...props
}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
	return <div className="c-text c-error" {...marginTokens} {...props} />;
};
