import React from "react";

import {Margins} from "../design-system";

type PlusIconProps = JSX.IntrinsicElements["path"] & Margins;

export const PlusIcon: React.FC<PlusIconProps> = ({m, mx, my, mt, mr, mb, ml, ...props}) => (
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
			d="M12 4V20M20 12L4 12"
			stroke="#4A5568"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		/>
	</svg>
);
