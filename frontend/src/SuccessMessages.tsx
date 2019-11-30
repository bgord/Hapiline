import React from "react";

export const SuccessMessage: React.FC<React.HTMLProps<HTMLDivElement>> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={`success-message w-auto flex justify-between mt-4 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

export const CloseableSuccessMessage: React.FC<
	React.HTMLProps<HTMLDivElement>
> = ({children, ...props}) => {
	const [on, setOn] = React.useState(true);
	const close = () => setOn(false);
	return (
		<>
			{on && (
				<SuccessMessage {...props}>
					{children}
					<button className="px-2" onClick={close}>
						x
					</button>
				</SuccessMessage>
			)}
		</>
	);
};
