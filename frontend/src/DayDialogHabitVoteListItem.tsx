import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

// TODO: replace with heroicons, eventually delete FA
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEquals, faMinus} from "@fortawesome/free-solid-svg-icons";
import {ChevronUpIcon} from "./ui/icons/ChevronUp";
import {ChevronDownIcon} from "./ui/icons/ChevronDown";
import VisuallyHidden from "@reach/visually-hidden";
import {habitStrengthToBadgeVariant, IHabit} from "./interfaces/IHabit";
import * as UI from "./ui";
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
	const textarea = useEditableFieldState();
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
			if (vote_id) {
				updateVoteCommentRequestState.run(vote_id, changedComment);
			} else {
				addEmptyHabitDayVoteRequestState.run({
					day: new Date(day),
					habit_id: habit.id,
					vote: null,
				});
			}
		},
		comment,
		true,
	);

	function changeVote(type: NonNullable<Vote>) {
		addHabitDayVoteRequestState.run({
			day: new Date(day),
			habit_id: habit.id,
			vote: vote === type ? null : type,
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
						<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
							<UI.Text variant="semi-bold">{habit.name}</UI.Text>
						</Link>
						<UI.Wrapper ml="auto">
							<UI.Button
								bg={vote === "progress" ? "green" : "gray-0"}
								style={{
									color: vote === "progress" ? "var(--green-dark)" : "var(--gray-10)",
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
								bg={vote === "plateau" ? "gray-2" : "gray-0"}
								style={{
									color: vote === "plateau" ? "var(--gray-9)" : "var(--gray-10)",
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
								bg={vote === "regress" ? "red" : "gray-0"}
								style={{
									color: vote === "regress" ? "var(--red-dark)" : "var(--gray-10)",
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
						<UI.Badge ml="48" mr="6" variant={habit.score}>
							{habit.score}
						</UI.Badge>
						<UI.Badge ml="6" variant={habitStrengthToBadgeVariant[habit.strength]}>
							{habit.strength}
						</UI.Badge>
						{!vote && (
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
									key={comment ?? undefined}
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
