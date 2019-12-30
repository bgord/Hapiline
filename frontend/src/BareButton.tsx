import React from "react";

export const BareButton: React.FC<JSX.IntrinsicElements["button"]> = ({
	className = "",
	...props
}) => <button className={`px-2 uppercase ${className}`} type="button" {...props} />;
