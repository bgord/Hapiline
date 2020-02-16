/* eslint-disable jsx-a11y/label-has-associated-control */

import "./label.css";
import React from "react";

export const Label: React.FC<JSX.IntrinsicElements["label"] & {
	htmlFor: JSX.IntrinsicElements["label"]["htmlFor"];
}> = props => <label className="c-label" {...props} />;
