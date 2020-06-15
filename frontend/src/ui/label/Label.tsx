/* eslint-disable jsx-a11y/label-has-associated-control */

import "./label.css";

import React from "react";

import {Margins} from "../design-system";

type LabelVariant = "normal" | "optional";

export const Label: React.FC<JSX.IntrinsicElements["label"] &
	Margins & {
		variant?: LabelVariant;
		htmlFor: JSX.IntrinsicElements["label"]["htmlFor"];
	}> = ({variant = "normal", mt, mr, mb, ml, ...props}) => (
	<label
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		data-variant={variant}
		className="c-label"
		{...props}
	/>
);
