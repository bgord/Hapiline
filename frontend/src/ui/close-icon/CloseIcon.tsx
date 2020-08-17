/* eslint-disable react/button-has-type */

import "./close-icon.css";

import React from "react";

import {Close} from "../icons/Close";

import * as UI from "../index";
import {Backgrounds, Margins} from "../design-system";

type CloseIconProps = React.ComponentPropsWithoutRef<"button"> & Margins & Backgrounds;

export function CloseIcon({bg, ...props}: CloseIconProps) {
	return (
		<UI.Button data-bg={bg} variant="bare" {...props}>
			<UI.VisuallyHidden>Close dialog</UI.VisuallyHidden>
			<Close />
		</UI.Button>
	);
}
