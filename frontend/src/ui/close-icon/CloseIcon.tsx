/* eslint-disable react/button-has-type */

import "./close-icon.css";

import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {Close} from "../icons/Close";

import * as UI from "../button/Button";
import {Backgrounds, Margins} from "../design-system";

type CloseIconProps = React.ComponentPropsWithoutRef<"button"> & Margins & Backgrounds;

export const CloseIcon: React.FC<CloseIconProps> = ({bg, ...props}) => (
	<UI.Button data-bg={bg} variant="bare" {...props}>
		<VisuallyHidden>Close dialog</VisuallyHidden>
		<Close />
	</UI.Button>
);
