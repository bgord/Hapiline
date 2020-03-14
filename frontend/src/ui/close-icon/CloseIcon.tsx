/* eslint-disable react/button-has-type */

import "./close-icon.css";

import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {Close} from "../icons/Close";

import * as UI from "../button/Button";
import {Margins} from "../margins";

type CloseIconProps = React.ComponentPropsWithoutRef<"button"> & Margins;

export const CloseIcon: React.FC<CloseIconProps> = props => (
	<UI.Button variant="bare" {...props}>
		<VisuallyHidden>Close dialog</VisuallyHidden>
		<Close />
	</UI.Button>
);
