import React from "react";

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
export function useEditableFieldValue({
	defaultValue,
	updateFn,
	allowEmptyString = false,
}: {
	updateFn: (value: string) => void;
	defaultValue: string | null | undefined;
	allowEmptyString?: boolean;
}): useEditableFieldValueReturnType {
	const castedDefaultValue = defaultValue ?? "";

	const [value, setValue] = React.useState<string | null | undefined>(() => castedDefaultValue);

	React.useEffect(() => {
		setValue(castedDefaultValue);
	}, [castedDefaultValue]);

	function onChange(
		event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
	) {
		setValue(event.target.value);
	}
	function onClear() {
		setValue(castedDefaultValue);
	}
	function onUpdate() {
		if (value === null || value === undefined || value === castedDefaultValue) return;

		if (value !== "" || allowEmptyString) {
			updateFn(value);
		}
	}
	return [value, {onClear, onChange, onUpdate}];
}
