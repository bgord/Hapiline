import React from "react";

type useTextareaStateProps = [
	"idle" | "focused",
	{setIdle: VoidFunction; setFocused: VoidFunction},
];
export function useTextareaState(): useTextareaStateProps {
	const [state, setState] = React.useState<"idle" | "focused">("idle");
	return [state, {setIdle: () => setState("idle"), setFocused: () => setState("focused")}];
}

type useEditableValueProps = [
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
): useEditableValueProps {
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
