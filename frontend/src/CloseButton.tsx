import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

export const DialogCloseButton: React.FC<{onClick: VoidFunction}> = ({onClick}) => (
	<button type="button" className="p-2" onClick={onClick}>
		<VisuallyHidden>Close</VisuallyHidden>
		<span aria-hidden>×</span>
	</button>
);
