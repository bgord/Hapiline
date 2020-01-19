import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
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
							<li key={voteComment.id} className="mb-4">
								<strong>
									{formatDay(voteComment.day)} ({formatDayName(voteComment.day)})
								</strong>
								<textarea disabled className="w-full border p-1 mt-1">
									{voteComment.comment}
								</textarea>
							</li>
						))}
					</ul>
				)}
			</Async.IfFulfilled>
		</div>
	);
};
