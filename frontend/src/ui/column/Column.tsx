import "./column.css";

import React from "react";

import {Margins} from "../margins";

export const Column: React.FC<JSX.IntrinsicElements["div"] & Margins> = ({
	mt,
	mr,
	mb,
	ml,
	...props
}) => <div data-mt={mt} data-mr={mr} data-mb={mb} data-ml={ml} className="c-column" {...props} />;
