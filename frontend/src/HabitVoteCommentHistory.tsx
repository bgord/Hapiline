import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {InfoMessage} from "./InfoMessage";
import {api} from "./services/api";
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
					<ul>
						{voteComments.map(voteComment => (
							<li key={voteComment.id}>{voteComment.comment}</li>
						))}
					</ul>
				)}
			</Async.IfFulfilled>
		</div>
	);
};
