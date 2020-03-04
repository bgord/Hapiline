import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {Field, Header, Label, Textarea, Text} from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {IVoteComment, voteToBgColor} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {constructUrl} from "./hooks/useQueryParam";
import {formatDay, formatDayName} from "./config/DATE_FORMATS";
import {useErrorNotification} from "./contexts/notifications-context";

export const HabitVoteCommentHistory: React.FC<{habitId: IHabit["id"]}> = ({habitId}) => {
	const triggerErrorNotification = useErrorNotification();

	const getHabitVoteCommentsRequestState = Async.useAsync({
		promiseFn: api.habit.getHabitVoteComments,
		habitId,
		onReject: () => triggerErrorNotification("Couldn't fetch vote comments."),
	});

	const voteComments = getHabitVoteCommentsRequestState?.data ?? [];

	return (
		<div>
			<Header mt="48" variant="extra-small">
				Vote comments
			</Header>
			<Async.IfRejected state={getHabitVoteCommentsRequestState}>
				<ErrorMessage className="mt-4">Couldn't fetch vote comments.</ErrorMessage>
			</Async.IfRejected>
			<Async.IfFulfilled state={getHabitVoteCommentsRequestState}>
				{voteComments.length === 0 && <Text mt="24">Future vote comments will appear here.</Text>}
				{voteComments.length > 0 && (
					<ul className="mt-6 mb-8">
						{voteComments.map(voteComment => (
							<HabitVoteComment key={voteComment.id} {...voteComment} />
						))}
					</ul>
				)}
			</Async.IfFulfilled>
		</div>
	);
};

const HabitVoteComment: React.FC<IVoteComment> = ({id, day, habit_id, vote, comment}) => {
	const voteUrl = constructUrl("calendar", {
		preview_day: formatDay(day),
		highlighted_habit_id: habit_id?.toString(),
	});

	const formattedDay = formatDay(day);
	const formattedDayName = formatDayName(day);

	const linkBgColor = voteToBgColor.get(vote);

	return (
		<li key={id} className="flex flex-col mb-4">
			<Field>
				<Label mb="6" htmlFor={comment}>
					{formattedDay} ({formattedDayName})
					<Link to={voteUrl} className={`${linkBgColor} px-2 ml-2`}>
						{vote?.toUpperCase() ?? "NO VOTE"}
					</Link>
				</Label>
				<Textarea id={comment} value={comment} disabled />
			</Field>
		</li>
	);
};
