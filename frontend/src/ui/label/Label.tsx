/* eslint-disable jsx-a11y/label-has-associated-control */

import "./label.css";

import React from "react";

import {Margins, getMarginTokens} from "../design-system";

type LabelVariant = "normal" | "optional";

export const Label: React.FC<JSX.IntrinsicElements["label"] &
	Margins & {
		variant?: LabelVariant;
		htmlFor: JSX.IntrinsicElements["label"]["htmlFor"];
	}> = ({variant = "normal", m, mx, my, mt, mr, mb, ml, ...props}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return <label className="c-label" data-variant={variant} {...marginTokens} {...props} />;
};
