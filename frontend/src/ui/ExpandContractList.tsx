import React from "react";

import * as UI from "./";

export function ExpandContractList({children, max}: UI.WithChildren<{max: number}>) {
	const [state, setState] = React.useState<"contracted" | "expanded">();

	const numberOfChildren = React.Children.count(children);

	const numberOfChildrenThatCanBeRevealed = numberOfChildren - max;
	const areThereAnyChildrenToBeRevealed = numberOfChildren > max;

	React.useEffect(() => {
		// Establish a starting position for the first render
		// and when either `numberOfChildren` or `max` changes,
		// which is represented by `areThereAnyChildrenToBeRevealed`.

		if (areThereAnyChildrenToBeRevealed) setState("contracted");
		else setState("expanded");
	}, [areThereAnyChildrenToBeRevealed]);

	return (
		<>
			{state === "expanded" && (
				<>
					{children}
					{areThereAnyChildrenToBeRevealed && (
						<UI.Button mt="12" variant="outlined" onClick={() => setState("contracted")}>
							Show less
						</UI.Button>
					)}
				</>
			)}
			{state === "contracted" && (
				<>
					{React.Children.toArray(children).filter(takeFirst(max))}
					<UI.Button mt="12" variant="outlined" onClick={() => setState("expanded")}>
						Show more ({numberOfChildrenThatCanBeRevealed})
					</UI.Button>
				</>
			)}
		</>
	);
}

function takeFirst(max: number) {
	return function(_item: any, index: number) {
		return index < max;
	};
}
