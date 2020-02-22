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

import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
import {Field} from "./ui/field/Field";
import {Textarea} from "./ui/textarea/Textarea";
import {Label} from "./ui/label/Label";
import {Button} from "./ui/button/Button";
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
			<li className="flex items-baseline justify-between bg-gray-100 my-2 p-2 mt-4">
				<Row>
					<Button variant="outlined" title="Show and edit comment" onClick={toggleComment}>
						{isCommentVisible && <FontAwesomeIcon icon={faChevronUp} />}
						{!isCommentVisible && <FontAwesomeIcon icon={faChevronDown} />}
					</Button>
					<HabitScore score={habit.score} className="px-1 py-1 ml-2" />
					<HabitStrength strength={habit.strength} className="px-1 py-1 mr-4" />
					<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
						<Text>{habit.name}</Text>
					</Link>
				</Row>
				{!vote && (
					<Text
						variant="bold"
						title="Vote for a habit"
						style={{marginLeft: "auto", marginRight: "6px"}}
					>
						!
					</Text>
				)}
				<Row style={{width: "auto"}}>
					<Button
						variant="outlined"
						onClick={() => changeVote("progress")}
						disabled={addHabitDayVoteRequestState.isPending}
					>
						<FontAwesomeIcon icon={faPlus} />
					</Button>
					<Button
						ml="6"
						variant="outlined"
						onClick={() => changeVote("plateau")}
						disabled={addHabitDayVoteRequestState.isPending}
					>
						<FontAwesomeIcon icon={faEquals} />
					</Button>
					<Button
						ml="6"
						variant="outlined"
						onClick={() => changeVote("regress")}
						disabled={addHabitDayVoteRequestState.isPending}
					>
						<FontAwesomeIcon icon={faMinus} />
					</Button>
				</Row>
			</li>
			{isCommentVisible && (
				<>
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
					<SaveButton {...textarea} onClick={newCommentHelpers.onUpdate}>
						Save
					</SaveButton>
					<CancelButton
						{...textarea}
						onClick={newCommentHelpers.onClear}
						style={{marginLeft: "6px"}}
					>
						Cancel
					</CancelButton>
				</>
			)}
		</>
	);
};
