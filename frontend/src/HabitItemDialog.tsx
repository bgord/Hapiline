import {Dialog} from "@reach/dialog";
import {format} from "date-fns";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {CloseButton} from "./CloseButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {EditableHabitStrengthSelect} from "./EditableHabitStrengthSelect";
import {ErrorMessage, RequestErrorMessage} from "./ErrorMessages";
import {HabitCharts} from "./HabitCharts";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useHabitsState} from "./contexts/habits-context";

const habitDialogGrid: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "100px 125px auto 100px",
	gridTemplateRows: "50px 100px 50px 50px 100px",
};

interface HabitItemDialogProps {
	habitId: IHabit["id"];
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<HabitItemDialogProps> = ({habitId, closeDialog}) => {
	const getHabitsRequestState = useHabitsState();

	const triggerErrorNotification = useErrorNotification();

	const habitRequestState = Async.useAsync({
		promiseFn: api.habit.show,
		id: habitId,
		onReject: () => triggerErrorNotification("Fetching task details failed."),
	});
	const habit = habitRequestState?.data as IHabit;

	function dismissDialog() {
		closeDialog();
		getHabitsRequestState.reload();
	}

	return (
		<Dialog
			style={{
				maxWidth: "1000px",
				maxHeight: "600px",
			}}
			className="w-full h-full"
			onDismiss={dismissDialog}
			aria-label="Show habit preview"
		>
			<Async.IfPending state={habitRequestState}>Loading details...</Async.IfPending>
			<Async.IfRejected state={habitRequestState}>
				<RequestErrorMessage>Couldn't fetch task details, please try again.</RequestErrorMessage>
			</Async.IfRejected>
			{habit?.id && (
				<>
					<div style={habitDialogGrid}>
						<strong style={{gridColumn: "span 3", alignSelf: "center"}}>Habit preview</strong>
						<CloseButton onClick={dismissDialog} />
						<EditableHabitScoreSelect
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.score}
						/>
						<EditableHabitStrengthSelect
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.strength}
						/>
						<EditableHabitNameInput
							{...habit}
							setHabitItem={habitRequestState.setData}
							key={habit?.name}
						/>
						<dl
							style={{gridColumn: 3, gridRow: 3, alignSelf: "center"}}
							className="flex items-baseline ml-4 mt-8"
						>
							<dt className="text-gray-600 uppercase text-sm font-bold">Created at:</dt>
							<dd className="text-sm ml-1 font-mono">
								{format(new Date(habit?.created_at), "yyyy/MM/dd HH:mm")}
							</dd>
							<dt className="text-gray-600 uppercase text-sm font-bold ml-4">Updated at:</dt>
							<dd className="text-sm ml-1 font-mono">
								{format(new Date(habit?.updated_at), "yyyy/MM/dd HH:mm")}
							</dd>
						</dl>
						<div
							className="text-green-600 uppercase text-sm font-bold ml-2"
							style={{gridColumn: "span 2", gridRow: 3, alignSelf: "end"}}
							hidden={!habit.progress_streak}
						>
							Progress streak: {habit.progress_streak} days
						</div>
						<div
							className="text-red-600 uppercase text-sm font-bold ml-2"
							style={{gridColumn: "span 2", gridRow: 3, alignSelf: "end"}}
							hidden={!habit.regress_streak}
						>
							Regress streak: {habit.regress_streak} days
						</div>
						<div
							className="text-gray-600 uppercase text-sm font-bold ml-2"
							style={{gridColumn: "span 2", gridRow: 3, alignSelf: "end"}}
							hidden={Boolean(habit.regress_streak || habit.progress_streak)}
						>
							No streak today
						</div>
						<HabitCharts id={habit.id} />
					</div>
					<div className="mb-6">
						<label htmlFor="description" className="field-label">
							Description
						</label>
						<EditableDescription
							description={habit.description}
							habitId={habit.id}
							onResolve={habitRequestState.reload}
						/>
					</div>
				</>
			)}
		</Dialog>
	);
};

const EditableDescription: React.FC<{
	description: IHabit["description"];
	habitId: IHabit["id"];
	onResolve: VoidFunction;
}> = ({description, habitId, onResolve}) => {
	const [state, setState] = React.useState<"idle" | "focused">("idle");

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const [newDescription, setNewDescription] = React.useState<IHabit["description"]>(
		() => description,
	);

	const updateDescriptionRequestState = Async.useAsync({
		deferFn: api.habit.patch,
		onResolve: () => {
			triggerSuccessNotification("Comment added successfully!");
			setState("idle");
			onResolve();
		},
		onReject: () => triggerErrorNotification("Habit description couldn't be changed"),
	});

	function updateDescription() {
		if (newDescription !== description)
			updateDescriptionRequestState.run(habitId, {description: newDescription});
	}

	const {getArgErrorMessage} = getRequestStateErrors(updateDescriptionRequestState);
	const descriptionInlineErrorMessage = getArgErrorMessage("description");

	return (
		<>
			<textarea
				onFocus={() => setState("focused")}
				placeholder="Write something..."
				className="w-full border p-2"
				value={newDescription ?? undefined}
				onChange={event => setNewDescription(event.target.value)}
			/>
			<Async.IfRejected state={updateDescriptionRequestState}>
				<ErrorMessage>{descriptionInlineErrorMessage}</ErrorMessage>
			</Async.IfRejected>
			{state === "focused" && <BareButton onClick={updateDescription}>Save</BareButton>}
			{state === "focused" && (
				<BareButton
					onClick={() => {
						setNewDescription(description || "");
						setState("idle");
					}}
				>
					Cancel
				</BareButton>
			)}
		</>
	);
};
