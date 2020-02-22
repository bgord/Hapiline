/* eslint-disable react/button-has-type */

import "./close-icon.css";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {Button} from "../button/Button";
import {Margins} from "../margins";

export const CloseIcon: React.FC<JSX.IntrinsicElements["button"] & Margins> = props => (
	<Button variant="outlined" {...props}>
		<VisuallyHidden>Close dialog</VisuallyHidden>
		<FontAwesomeIcon className="c-close-icon" icon={faTimes} />
	</Button>
);
