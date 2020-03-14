import React from "react";

import {Margins} from "../margins";

type PlusCircleIconProps = JSX.IntrinsicElements["path"] & Margins;

export const PlusCircleIcon: React.FC<PlusCircleIconProps> = ({
	m,
	mx,
	my,
	mt,
	mr,
	mb,
	ml,
	...props
}) => (
	<svg
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
			stroke="var(--gray-1)"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		/>
	</svg>
);
