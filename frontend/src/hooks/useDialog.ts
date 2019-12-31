import React from "react";

type useDialogType = [boolean, VoidFunction, VoidFunction];

export const useDialog = (defaultValue = false): useDialogType => {
	const [showDialog, setShowDialog] = React.useState(defaultValue);

	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);

	return [showDialog, openDialog, closeDialog];
};
