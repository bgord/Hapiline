import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit} from "./interfaces/IHabit";
import {Vote, IDayVote} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {
	useEditableFieldState,
	useEditableFieldValue,
	CancelButton,
	SaveButton,
} from "./hooks/useEditableField";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {constructUrl} from "./hooks/useQueryParam";
import {useToggle} from "./hooks/useToggle";

interface DayDialogHabitVoteListProps {
	habit: IHabit;
	day: string;
	vote: IDayVote["vote"] | undefined;
	vote_id: IDayVote["vote_id"] | undefined;
	comment: IDayVote["comment"] | undefined;
	onResolve: VoidFunction;
}

export const DayDialogHabitVoteListItem: React.FC<DayDialogHabitVoteListProps> = ({
	onResolve,
	vote,
	comment,
	habit,
	day,
	vote_id,
}) => {
	const [isCommentVisible, , , toggleComment] = useToggle();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const addHabitDayVoteRequestState = Async.useAsync({
		deferFn: api.habit.addHabitDayVote,
		onResolve: () => {
			triggerSuccessNotification("Habit vote added successfully!");
			onResolve();
		},
		onReject: () => triggerErrorNotification("Error while changing habit vote."),
	});

	const progressButtonBg = vote === "progress" ? "bg-green-300" : "bg-white";
	const plateauButtonBg = vote === "plateau" ? "bg-gray-300" : "bg-white";
	const regressButtonBg = vote === "regress" ? "bg-red-300" : "bg-white";

	function changeVote(type: NonNullable<Vote>) {
		addHabitDayVoteRequestState.run({
			day: new Date(day),
			habit_id: habit.id,
			vote: vote === type ? null : type,
		});
	}

	return (
		<>
			<li className="flex items-baseline justify-between bg-gray-100 my-2 p-2 mt-4">
				<div className="flex items-center">
					<BareButton title="Show and edit comment" onClick={toggleComment}>
						{isCommentVisible ? "⌃" : "⌄"}
					</BareButton>
					<HabitScore score={habit.score} className="px-1 py-1" />
					<HabitStrength strength={habit.strength} className="px-1 py-1 mr-4" />
					<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
						{habit.name}
					</Link>
				</div>
				{!vote && (
					<div title="Vote for a habit" className="ml-auto text-red-600 mr-1 px-2 font-bold">
						!
					</div>
				)}
				<div>
					<BareButton
						onClick={() => changeVote("progress")}
						className={progressButtonBg}
						disabled={addHabitDayVoteRequestState.isPending}
					>
						+
					</BareButton>
					<BareButton
						onClick={() => changeVote("plateau")}
						className={plateauButtonBg}
						disabled={addHabitDayVoteRequestState.isPending}
					>
						=
					</BareButton>
					<BareButton
						onClick={() => changeVote("regress")}
						disabled={addHabitDayVoteRequestState.isPending}
						className={regressButtonBg}
					>
						-
					</BareButton>
				</div>
			</li>
			{isCommentVisible && (
				<EditableVoteComment comment={comment} voteId={vote_id} onResolve={onResolve} />
			)}
		</>
	);
};

const EditableVoteComment: React.FC<{
	comment: IDayVote["comment"];
	voteId: IDayVote["vote_id"] | undefined;
	onResolve: VoidFunction;
}> = ({comment, voteId, onResolve}) => {
	const textarea = useEditableFieldState();

	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const updateVoteCommentRequestState = Async.useAsync({
		deferFn: api.habit.updateVoteComment,
		onResolve: () => {
			triggerSuccessNotification("Comment added successfully!");
			textarea.setIdle();
			onResolve();
		},
		onReject: () => triggerErrorNotification("Couldn't add comment"),
	});

	const [newComment, newCommentHelpers] = useEditableFieldValue(
		changedComment => updateVoteCommentRequestState.run(voteId, changedComment),
		comment,
	);

	return (
		<>
			<textarea
				onFocus={textarea.setFocused}
				placeholder="Write something..."
				className="w-full border p-2"
				value={newComment ?? undefined}
				onChange={newCommentHelpers.onChange}
			/>
			<SaveButton {...textarea} onClick={newCommentHelpers.onUpdate}>
				Save
			</SaveButton>
			<CancelButton {...textarea} onClick={newCommentHelpers.onClear}>
				Cancel
			</CancelButton>
		</>
	);
};
