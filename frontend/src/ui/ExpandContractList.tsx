import React from "react";

import * as UI from "./";

// TODO: Document the logic of this component
export const ExpandContractList: React.FC<{max: number}> = ({children, max}) => {
	const [state, setState] = React.useState<"contracted" | "expanded">();

	const itemCount = React.Children.count(children);
	const itemsToExpandCount = itemCount - max;
	const isExpandable = itemCount > max;

	React.useEffect(() => {
		if (itemCount > max) setState("contracted");
		else setState("expanded");
	}, [itemCount, max]);

	return (
		<>
			{state === "expanded" && (
				<>
					{children}
					{isExpandable && (
						<UI.Button mt="12" variant="outlined" onClick={() => setState("contracted")}>
							Show less
						</UI.Button>
					)}
				</>
			)}
			{state === "contracted" && (
				<>
					{React.Children.toArray(children).filter((_, index) => index < max)}
					<UI.Button mt="12" variant="outlined" onClick={() => setState("expanded")}>
						Show more ({itemsToExpandCount})
					</UI.Button>
				</>
			)}
		</>
	);
};
