import {Link, useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {HabitScore} from "./HabitScore";
import {HabitStrength} from "./HabitStrength";
import {IHabit} from "./interfaces/IHabit";
import {Vote, IDayVote} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {useTextareaState, useEditableValue} from "./hooks/useEditableTextarea";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";
import {useQueryParam} from "./hooks/useQueryParam";
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
	const history = useHistory();
	const highlightedHabitId = useQueryParam("highlightedHabitId");
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

	const isHabitHighlighted = Number(highlightedHabitId) === habit.id;
	const isCommentToggleEnabled = vote !== null && vote !== undefined;
	const commentToggleTitle = isCommentToggleEnabled
		? "Show and edit comment"
		: "Vote to be able to add comment";

	return (
		<>
			<li className="flex items-baseline justify-between bg-gray-100 my-2 p-2 mt-4">
				<div className="flex items-center">
					<BareButton
						title={commentToggleTitle}
						disabled={!isCommentToggleEnabled}
						onClick={toggleComment}
					>
						{isCommentVisible ? "⌃" : "⌄"}
					</BareButton>
					<BareButton
						className="mr-4"
						onClick={() => history.push(`/calendar?previewDay=${day}`)}
						hidden={!isHabitHighlighted}
					>
						Unmark
					</BareButton>
					<HabitScore score={habit.score} className="px-1 py-1" />
					<HabitStrength strength={habit.strength} className="px-1 py-1 mr-4" />
					<Link
						to={`/dashboard?previewHabitId=${habit.id}`}
						className={isHabitHighlighted ? "text-blue-600" : ""}
					>
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
			{isCommentVisible && isCommentToggleEnabled && (
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
	const [state, textareaHelpers] = useTextareaState();

	const triggerSuccessNotification = useSuccessNotification();

	const updateVoteCommentRequestState = Async.useAsync({
		deferFn: api.habit.updateVoteComment,
		onResolve: () => {
			triggerSuccessNotification("Comment added successfully!");
			textareaHelpers.setIdle();
			onResolve();
		},
	});

	const [newComment, newCommentHelpers] = useEditableValue(
		newComment => updateVoteCommentRequestState.run(voteId, newComment),
		comment,
	);

	return (
		<>
			<textarea
				onFocus={textareaHelpers.setFocused}
				placeholder="Write something..."
				className="w-full border p-2"
				value={newComment ?? undefined}
				onChange={newCommentHelpers.onChange}
			/>
			{state === "focused" && <BareButton onClick={newCommentHelpers.onUpdate}>Save</BareButton>}
			{state === "focused" && (
				<BareButton
					onClick={() => {
						newCommentHelpers.onClear();
						textareaHelpers.setIdle();
					}}
				>
					Cancel
				</BareButton>
			)}
		</>
	);
};
