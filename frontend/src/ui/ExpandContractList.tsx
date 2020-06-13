import React from "react";

import * as UI from "./";

// TODO: Document the logic of this component
export const ExpandContractList: React.FC<{max: number}> = ({children, max}) => {
	const [state, setState] = React.useState<"contracted" | "expanded">();

	const numberOfItems = React.Children.count(children);
	const numberOfItemsToExpand = numberOfItems - max;

	const isExpandable = numberOfItems > max;

	React.useEffect(() => {
		if (numberOfItems > max) setState("contracted");
		else setState("expanded");
	}, [numberOfItems, max]);

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
						Show more ({numberOfItemsToExpand})
					</UI.Button>
				</>
			)}
		</>
	);
};
