import React from "react";

type StatProps = {
	count: number | undefined;
	sign: "+" | "=" | "-" | "?";
};

export const Stat: React.FC<StatProps & JSX.IntrinsicElements["span"]> = ({
	sign,
	count,
	hidden = count === undefined,
}) => {
	return <span hidden={hidden} className="ml-2 bg-green-200">{`${sign}${count}`}</span>;
};
