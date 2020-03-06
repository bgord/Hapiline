import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
	faChevronUp,
	faChevronDown,
	faPlus,
	faEquals,
	faMinus,
} from "@fortawesome/free-solid-svg-icons";
import VisuallyHidden from "@reach/visually-hidden";
import {habitStrengthToBadgeVariant, IHabit} from "./interfaces/IHabit";
import {Button, Text, Textarea, Field, Row, Column, Label, Badge} from "./ui";
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
			<Row
				pb="12"
				width="100%"
				style={{
					borderTop: "1px solid var(--gray-1)",
					borderBottom: "1px solid var(--gray-1)",
				}}
			>
				<Column data-width="100%">
					<Row pt="6">
						<Button variant="bare" title="Show and edit comment" onClick={toggleComment}>
							{isCommentVisible && (
								<>
									<VisuallyHidden>Hide vote comment</VisuallyHidden>
									<FontAwesomeIcon icon={faChevronUp} />
								</>
							)}
							{!isCommentVisible && (
								<>
									<VisuallyHidden>Show vote comment</VisuallyHidden>
									<FontAwesomeIcon icon={faChevronDown} />
								</>
							)}
						</Button>
						<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
							<Text ml="12" variant="semi-bold">
								{habit.name}
							</Text>
						</Link>
						<div data-ml="auto">
							<Button
								style={{background: vote === "progress" ? "#3ddc97" : "white"}}
								variant="bare"
								onClick={() => changeVote("progress")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add progress vote</VisuallyHidden>
								<FontAwesomeIcon icon={faPlus} />
							</Button>
							<Button
								style={{background: vote === "plateau" ? "#cfdee7" : "white"}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("plateau")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add plateau vote</VisuallyHidden>
								<FontAwesomeIcon icon={faEquals} />
							</Button>
							<Button
								style={{background: vote === "regress" ? "#ff495c" : "white"}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("regress")}
								disabled={addHabitDayVoteRequestState.isPending}
							>
								<VisuallyHidden>Add regress vote</VisuallyHidden>
								<FontAwesomeIcon icon={faMinus} />
							</Button>
						</div>
					</Row>
					<Row mt="6">
						<Badge ml="48" mr="6" variant={habit.score}>
							{habit.score}
						</Badge>
						<Badge ml="6" variant={habitStrengthToBadgeVariant[habit.strength]}>
							{habit.strength}
						</Badge>
						{!vote && (
							<Text ml="auto" mr="6" variant="bold" title="Vote for a habit">
								!
							</Text>
						)}
					</Row>
					{isCommentVisible && (
						<Column mt="12">
							<Field mb="12">
								<Label htmlFor="vote_comment">Vote comment</Label>
								<Textarea
									id="vote_comment"
									key={comment ?? undefined}
									onFocus={textarea.setFocused}
									placeholder="Write something..."
									value={newComment ?? undefined}
									onChange={newCommentHelpers.onChange}
								/>
							</Field>
							<Row>
								<SaveButton {...textarea} onClick={newCommentHelpers.onUpdate}>
									Save
								</SaveButton>
								<CancelButton {...textarea} onClick={newCommentHelpers.onClear}>
									Cancel
								</CancelButton>
							</Row>
						</Column>
					)}
				</Column>
			</Row>
		</>
	);
};
