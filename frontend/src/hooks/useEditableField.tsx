import React from "react";

import {BareButton} from "../BareButton";

interface UseEditableFieldStateReturnType {
	state: "idle" | "focused";
	setIdle: VoidFunction;
	setFocused: VoidFunction;
}
export function useEditableFieldState(): UseEditableFieldStateReturnType {
	const [state, setState] = React.useState<"idle" | "focused">("idle");
	return {
		state,
		setIdle: () => setState("idle"),
		setFocused: () => setState("focused"),
	};
}

type useEditableFieldValueReturnType = [
	string | null | undefined,
	{
		onClear: VoidFunction;
		onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
		onUpdate: VoidFunction;
	},
];
export function useEditableFieldValue(
	updateFn: (value: string) => void,
	defaultValue: string | null | undefined,
): useEditableFieldValueReturnType {
	const [value, setValue] = React.useState<string | null | undefined>(() => defaultValue);

	function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setValue(event.target.value);
	}
	function onClear() {
		setValue(defaultValue || "");
	}
	function onUpdate() {
		if (value && value !== defaultValue) updateFn(value);
	}
	return [value, {onClear, onChange, onUpdate}];
}

export const CancelButton: React.FC<UseEditableFieldStateReturnType &
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

export const SaveButton: React.FC<UseEditableFieldStateReturnType &
	JSX.IntrinsicElements["button"]> = ({state, setIdle, setFocused, ...props}) => {
	return <>{state === "focused" && <BareButton {...props} />}</>;
};
