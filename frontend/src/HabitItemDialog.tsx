import {Dialog} from "@reach/dialog";
import {format} from "date-fns";
import * as Async from "react-async";
import React from "react";

import {CloseButton} from "./CloseButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {EditableHabitStrengthSelect} from "./EditableHabitStrengthSelect";
import {IHabit} from "./interfaces/IHabit";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";

interface Props {
	habitId: IHabit["id"];
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<Props> = ({habitId, closeDialog}) => {
	const getHabitsRequestState = useHabitsState();

	const triggerErrorNotification = useErrorNotification();

	const singleItemRequestState = Async.useAsync({
		promiseFn: api.habit.show,
		id: habitId,
		onReject: () => triggerErrorNotification("Fetching task details failed."),
	});

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "100px 125px auto 100px",
		gridTemplateRows: "50px 100px 50px",
	};

	return (
		<Dialog
			style={{
				maxWidth: "1000px",
				maxHeight: "500px",
			}}
			className="w-full h-full"
			onDismiss={getHabitsRequestState.reload}
			aria-label="Show habit preview"
		>
			<Async.IfPending state={singleItemRequestState}>Loading details...</Async.IfPending>
			<Async.IfRejected state={singleItemRequestState}>
				<RequestErrorMessage>Couldn't fetch task details, please try again.</RequestErrorMessage>
			</Async.IfRejected>
			{singleItemRequestState?.data?.id && (
				<div style={habitDialogGrid}>
					<strong style={{gridColumn: "span 3", alignSelf: "center"}}>Habit preview</strong>
					<CloseButton
						onClick={() => {
							closeDialog();
							getHabitsRequestState.reload();
						}}
					/>
					<EditableHabitScoreSelect
						{...singleItemRequestState?.data}
						setHabitItem={singleItemRequestState.setData}
						key={singleItemRequestState?.data?.score}
					/>
					<EditableHabitStrengthSelect
						{...singleItemRequestState?.data}
						setHabitItem={singleItemRequestState.setData}
						key={singleItemRequestState?.data?.strength}
					/>
					<EditableHabitNameInput
						{...singleItemRequestState?.data}
						setHabitItem={singleItemRequestState.setData}
						key={singleItemRequestState?.data?.name}
					/>
					<dl
						style={{gridColumn: 3, gridRow: 3, alignSelf: "center"}}
						className="flex items-baseline ml-4 mt-8"
					>
						<dt className="text-gray-600 uppercase text-sm font-bold">Created at:</dt>
						<dd className="text-sm ml-1 font-mono">
							{format(new Date(singleItemRequestState?.data?.created_at), "yyyy/MM/dd HH:mm")}
						</dd>
						<dt className="text-gray-600 uppercase text-sm font-bold ml-4">Updated at:</dt>
						<dd className="text-sm ml-1 font-mono">
							{format(new Date(singleItemRequestState?.data?.updated_at), "yyyy/MM/dd HH:mm")}
						</dd>
					</dl>
				</div>
			)}
		</Dialog>
	);
};
