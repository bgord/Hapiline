/* eslint-disable react/button-has-type */

import "./close-icon.css";

import React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

import {Button} from "../button/Button";

export const CloseIcon: React.FC<JSX.IntrinsicElements["button"]> = props => (
	<Button variant="outlined" {...props}>
		<VisuallyHidden>Close dialog</VisuallyHidden>
		<FontAwesomeIcon className="c-close-icon" icon={faTimes} />
	</Button>
);
