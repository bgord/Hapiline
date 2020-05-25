import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

// TODO: replace with heroicons, eventually delete FA
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEquals, faMinus} from "@fortawesome/free-solid-svg-icons";
import {ChevronUpIcon} from "./ui/icons/ChevronUp";
import {ChevronDownIcon} from "./ui/icons/ChevronDown";
import VisuallyHidden from "@reach/visually-hidden";
import {
	HabitVoteType,
	habitStrengthToBadgeVariant,
	HabitWithPossibleHabitVote,
} from "./interfaces/index";
import * as UI from "./ui";
import {api} from "./services/api";
import {
	useEditableFieldState,
	useEditableFieldValue,
	CancelButton,
	SaveButton,
} from "./hooks/useEditableField";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {constructUrl} from "./hooks/useQueryParam";
import {useToggle} from "./hooks/useToggle";

export const DayDialogHabitVoteListItem: React.FC<HabitWithPossibleHabitVote & {
	onResolve: VoidFunction;
	day: string;
}> = ({onResolve, day, ...habitWithPossibleVote}) => {
	const textarea = useEditableFieldState();
	const [isCommentVisible, , , toggleComment] = useToggle();

	const triggerSuccessNotification = useSuccessToast();
	const triggerErrorNotification = useErrorToast();

	const currentVoteType = habitWithPossibleVote.vote?.vote;

	const addHabitDayVoteRequestState = Async.useAsync({
		deferFn: api.habit.addHabitDayVote,
		onResolve: () => {
			triggerSuccessNotification("Habit vote added successfully!");
			onResolve();
		},
		onReject: () => triggerErrorNotification("Error while changing habit vote."),
	});

	const upsertCommentResponseHandlers = {
		onResolve: () => {
			triggerSuccessNotification("Comment added successfully!");
			textarea.setIdle();
			onResolve();
		},
		onReject: () => triggerErrorNotification("Couldn't add comment"),
	};

	const updateVoteCommentRequestState = Async.useAsync({
		deferFn: api.habit.updateVoteComment,
		...upsertCommentResponseHandlers,
	});

	const addEmptyHabitDayVoteRequestState = Async.useAsync({
		deferFn: api.habit.addHabitDayVote,
		...upsertCommentResponseHandlers,
	});

	const [newComment, newCommentHelpers] = useEditableFieldValue(
		changedComment => {
			if (habitWithPossibleVote.vote?.id) {
				updateVoteCommentRequestState.run(habitWithPossibleVote.vote.id, changedComment);
			} else {
				addEmptyHabitDayVoteRequestState.run({
					day: new Date(day),
					habit_id: habitWithPossibleVote.id,
					vote: null,
				});
			}
		},
		habitWithPossibleVote.vote?.comment,
		true,
	);

	function changeVote(type: NonNullable<HabitVoteType>) {
		addHabitDayVoteRequestState.run({
			day: new Date(day),
			habit_id: habitWithPossibleVote.id,
			vote: currentVoteType === type ? null : type,
		});
	}

	return (
		<>
			<UI.Row as="li" pb="12" width="100%" by="gray-1">
				<UI.Column width="100%">
					<UI.Row pt="6">
						{isCommentVisible && (
							<UI.Button variant="bare" title="Hide vote comment" onClick={toggleComment}>
								<VisuallyHidden>Hide vote comment</VisuallyHidden>
								<ChevronUpIcon />
							</UI.Button>
						)}
						{!isCommentVisible && (
							<UI.Button variant="bare" title="Show and edit comment" onClick={toggleComment}>
								<VisuallyHidden>Show and edit vote comment</VisuallyHidden>
								<ChevronDownIcon />
							</UI.Button>
						)}
						<Link
							to={constructUrl("habits", {preview_habit_id: habitWithPossibleVote.id.toString()})}
						>
							<UI.Text variant="semi-bold">{habitWithPossibleVote.name}</UI.Text>
						</Link>
						<UI.Wrapper ml="auto">
							<UI.Button
								bg={currentVoteType === "progress" ? "green" : "gray-0"}
								style={{
									color: currentVoteType === "progress" ? "var(--green-dark)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								variant="bare"
								onClick={() => changeVote("progress")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add progress vote</VisuallyHidden>
								<FontAwesomeIcon icon={faPlus} />
							</UI.Button>
							<UI.Button
								bg={currentVoteType === "plateau" ? "gray-2" : "gray-0"}
								style={{
									color: currentVoteType === "plateau" ? "var(--gray-9)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("plateau")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add plateau vote</VisuallyHidden>
								<FontAwesomeIcon icon={faEquals} />
							</UI.Button>
							<UI.Button
								bg={currentVoteType === "regress" ? "red" : "gray-0"}
								style={{
									color: currentVoteType === "regress" ? "var(--red-dark)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("regress")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add regress vote</VisuallyHidden>
								<FontAwesomeIcon icon={faMinus} />
							</UI.Button>
						</UI.Wrapper>
					</UI.Row>
					<UI.Row mt="6">
						<UI.Badge ml="48" mr="6" variant={habitWithPossibleVote.score}>
							{habitWithPossibleVote.score}
						</UI.Badge>
						<UI.Badge ml="6" variant={habitStrengthToBadgeVariant[habitWithPossibleVote.strength]}>
							{habitWithPossibleVote.strength}
						</UI.Badge>
						{!currentVoteType && (
							<UI.Badge ml="auto" variant="neutral">
								No vote yet
							</UI.Badge>
						)}
					</UI.Row>
					{isCommentVisible && (
						<UI.Column mt="24" pl="48">
							<UI.Field mb="12">
								<UI.Label htmlFor="vote_comment">Vote comment</UI.Label>
								<UI.Textarea
									id="vote_comment"
									key={habitWithPossibleVote.vote?.comment ?? undefined}
									onFocus={textarea.setFocused}
									placeholder="Write something..."
									value={newComment ?? undefined}
									onChange={newCommentHelpers.onChange}
								/>
							</UI.Field>
							<UI.Row mb="12">
								<SaveButton {...textarea} onClick={newCommentHelpers.onUpdate}>
									Save
								</SaveButton>
								<CancelButton {...textarea} onClick={newCommentHelpers.onClear}>
									Cancel
								</CancelButton>
							</UI.Row>
						</UI.Column>
					)}
				</UI.Column>
			</UI.Row>
		</>
	);
};
