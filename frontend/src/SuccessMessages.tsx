import React from "react";

export const SuccessMessage: React.FC<JSX.IntrinsicElements["div"]> = ({
	className = "",
	...props
}) => {
	return (
		<div className={`success-message w-auto flex justify-between mt-4 ${className}`} {...props} />
	);
};

export const CloseableSuccessMessage: React.FC<JSX.IntrinsicElements["div"]> = ({
	children,
	...props
}) => {
	const [on, setOn] = React.useState(true);
	const close = () => setOn(false);
	return (
		<>
			{on && (
				<SuccessMessage {...props}>
					{children}
					<button type="button" className="px-2" onClick={close}>
						x
					</button>
				</SuccessMessage>
			)}
		</>
	);
};
