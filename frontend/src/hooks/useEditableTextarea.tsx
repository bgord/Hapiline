import React from "react";

import {BareButton} from "../BareButton";

interface UseTextareaStateReturnType {
	state: "idle" | "focused";
	setIdle: VoidFunction;
	setFocused: VoidFunction;
}
export function useTextareaState(): UseTextareaStateReturnType {
	const [state, setState] = React.useState<"idle" | "focused">("idle");
	return {
		state,
		setIdle: () => setState("idle"),
		setFocused: () => setState("focused"),
	};
}

type useEditableValueReturnType = [
	string | null | undefined,
	{
		onClear: VoidFunction;
		onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
		onUpdate: VoidFunction;
	},
];
export function useEditableValue(
	updateFn: (value: string) => void,
	defaultValue: string | null | undefined,
): useEditableValueReturnType {
	const [value, setValue] = React.useState<string | null | undefined>(() => defaultValue);

	function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setValue(event.target.value);
	}
	function onClear() {
		return setValue(defaultValue || "");
	}
	function onUpdate() {
		if (value && value !== defaultValue) updateFn(value);
	}
	return [value, {onClear, onChange, onUpdate}];
}

export const CancelButton: React.FC<UseTextareaStateReturnType &
	JSX.IntrinsicElements["button"]> = ({state, setIdle, setFocused, onClick, ...props}) => {
	return (
		<>
			{state === "focused" && (
				<BareButton
					onClick={event => {
						setIdle();
						if (onClick) onClick(event);
					}}
					{...props}
				/>
			)}
		</>
	);
};

export const SaveButton: React.FC<UseTextareaStateReturnType & JSX.IntrinsicElements["button"]> = ({
	state,
	setIdle,
	setFocused,
	...props
}) => {
	return <>{state === "focused" && <BareButton {...props} />}</>;
};
