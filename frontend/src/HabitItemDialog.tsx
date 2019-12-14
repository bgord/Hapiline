import {Dialog} from "@reach/dialog";
import {format} from "date-fns";
import * as Async from "react-async";
import React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {IHabit} from "./interfaces/IHabit";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

interface Props {
	habitId: IHabit["id"];
	refreshList: VoidFunction;
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<Props> = ({
	refreshList,
	habitId,
	closeDialog,
}) => {
	const [triggerErrorNotification] = useNotification({
		type: "error",
		message: "Fetching task details failed.",
	});

	const singleItemRequestState = Async.useAsync({
		promiseFn: api.habit.show,
		id: habitId,
		onReject: triggerErrorNotification,
	});

	return (
		<Dialog
			style={{
				maxWidth: "1000px",
				maxHeight: "500px",
			}}
			className="w-full h-full"
			onDismiss={refreshList}
			aria-label="Show habit preview"
		>
			<Async.IfPending state={singleItemRequestState}>
				Loading details...
			</Async.IfPending>
			<Async.IfRejected state={singleItemRequestState}>
				<RequestErrorMessage>
					Couldn't fetch task details, please try again.
				</RequestErrorMessage>
			</Async.IfRejected>
			{singleItemRequestState?.data?.id && (
				<>
					<div className="flex justify-between items-center mb-8">
						<h2 className="font-bold">Habit preview</h2>
						<button
							className="p-2"
							onClick={() => {
								closeDialog();
								refreshList();
							}}
						>
							<VisuallyHidden>Close</VisuallyHidden>
							<span aria-hidden>×</span>
						</button>
					</div>
					<div className="flex items-end">
						<EditableHabitScoreSelect
							{...singleItemRequestState?.data}
							setHabitItem={singleItemRequestState.setData}
							key={singleItemRequestState?.data?.score}
						/>
						<EditableHabitNameInput
							{...singleItemRequestState?.data}
							setHabitItem={singleItemRequestState.setData}
							key={singleItemRequestState?.data?.name}
						/>
					</div>
					<dl className="flex items-baseline mt-4 ml-20 pl-2">
						<dt className="text-gray-600 uppercase text-sm font-bold">
							Created at:
						</dt>
						<dd className="text-sm ml-1 font-mono">
							{format(
								new Date(singleItemRequestState?.data?.created_at),
								"yyyy/MM/dd HH:mm",
							)}
						</dd>
						<dt className="text-gray-600 uppercase text-sm font-bold ml-4">
							Updated at:
						</dt>
						<dd className="text-sm ml-1 font-mono">
							{format(
								new Date(singleItemRequestState?.data?.updated_at),
								"yyyy/MM/dd HH:mm",
							)}
						</dd>
					</dl>
				</>
			)}
		</Dialog>
	);
};
