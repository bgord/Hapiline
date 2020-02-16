/* eslint-disable jsx-a11y/label-has-associated-control */

import "./label.css";
import React from "react";

type LabelVariant = "normal" | "optional";

export const Label: React.FC<JSX.IntrinsicElements["label"] & {
	variant?: LabelVariant;
	htmlFor: JSX.IntrinsicElements["label"]["htmlFor"];
}> = ({variant = "normal", ...props}) => (
	<label className={`c-label c-label--${variant}`} {...props} />
);
