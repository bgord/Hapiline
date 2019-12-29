import React from "react";

export const useDialog = (defaultValue = false): [boolean, VoidFunction, VoidFunction] => {
	const [showDialog, setShowDialog] = React.useState(defaultValue);

	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);

	return [showDialog, openDialog, closeDialog];
};
