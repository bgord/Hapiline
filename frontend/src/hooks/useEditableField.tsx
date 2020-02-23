import React from "react";

import {Button} from "../ui/button/Button";

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
		onChange: (
			event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
		) => void;
		onUpdate: VoidFunction;
	},
];
export function useEditableFieldValue(
	updateFn: (value: string) => void,
	defaultValue: string | null | undefined,
	allowEmptyString = false,
): useEditableFieldValueReturnType {
	const [value, setValue] = React.useState<string | null | undefined>(() => defaultValue);

	function onChange(
		event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
	) {
		setValue(event.target.value);
	}
	function onClear() {
		setValue(defaultValue || "");
	}
	function onUpdate() {
		if (allowEmptyString) {
			if (value === null || value === undefined || value === defaultValue) return;
			updateFn(value);
		}

		if (!allowEmptyString) {
			if (value === null || value === undefined || value === "" || value === defaultValue) return;
			updateFn(value);
		}
	}
	return [value, {onClear, onChange, onUpdate}];
}

export const CancelButton: React.FC<UseEditableFieldStateReturnType &
	JSX.IntrinsicElements["button"]> = ({state, setIdle, setFocused, onClick, ...props}) => (
	<>
		{state === "focused" && (
			<Button
				ml="6"
				variant="outlined"
				onClick={event => {
					setIdle();
					if (onClick) onClick(event);
				}}
				{...props}
			/>
		)}
	</>
);

export const SaveButton: React.FC<UseEditableFieldStateReturnType &
	JSX.IntrinsicElements["button"]> = ({state, setIdle, setFocused, ...props}) => (
	<>{state === "focused" && <Button variant="primary" {...props} />}</>
);
