import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {IVoteComment, voteToBgColor} from "./interfaces/IDayVote";
import {InfoMessage} from "./InfoMessage";
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
			<strong>Vote comments</strong>
			<Async.IfRejected state={getHabitVoteCommentsRequestState}>
				<ErrorMessage className="mt-4">Couldn't fetch vote comments.</ErrorMessage>
			</Async.IfRejected>
			<Async.IfFulfilled state={getHabitVoteCommentsRequestState}>
				{voteComments.length === 0 && (
					<InfoMessage>Future vote comments will appear here.</InfoMessage>
				)}
				{voteComments.length > 0 && (
					<ul className="my-8">
						{voteComments.map(voteComment => (
							<HabitVoteComment {...voteComment} />
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
			<div className="flex">
				<strong>
					{formattedDay} ({formattedDayName})
				</strong>
				<Link to={voteUrl} className={`${linkBgColor} px-2 ml-4`}>
					{vote?.toUpperCase() ?? "NO VOTE"}
				</Link>
			</div>
			<textarea value={comment} disabled className="w-full border p-1 mt-1" />
		</li>
	);
};
