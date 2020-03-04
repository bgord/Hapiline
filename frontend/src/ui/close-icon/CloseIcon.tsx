/* eslint-disable react/button-has-type */

import "./close-icon.css";

import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {Close} from "../icons/Close";

import {Button} from "../button/Button";
import {Margins} from "../margins";

export const CloseIcon: React.FC<JSX.IntrinsicElements["button"] & Margins> = props => (
	<Button variant="bare" {...props}>
		<VisuallyHidden>Close dialog</VisuallyHidden>
		<Close />
	</Button>
);
