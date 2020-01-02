import React from "react";

type StatProps = {
	count: number | undefined;
	sign: "+" | "=" | "-" | "?";
} & JSX.IntrinsicElements["span"];

export const Stat: React.FC<StatProps> = ({sign, count = undefined, ...props}) => {
	return <span className="ml-2 bg-green-200 self-start" {...props}>{`${sign}${count ?? 0}`}</span>;
};
