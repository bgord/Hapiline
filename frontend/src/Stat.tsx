import React from "react";

type StatProps = {
	count: number | undefined;
	sign: "+" | "=" | "-" | "?";
} & JSX.IntrinsicElements["span"];

export const Stat: React.FC<StatProps> = ({sign, count, hidden = count === undefined}) => {
	return <span hidden={hidden} className="ml-2 bg-green-200 self-start">{`${sign}${count}`}</span>;
};
