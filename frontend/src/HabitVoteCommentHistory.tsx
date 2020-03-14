import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {IVoteComment} from "./interfaces/IDayVote";
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
		<>
			<UI.Header mt="48" mb="24" variant="extra-small">
				Vote comments
			</UI.Header>

			<Async.IfRejected state={getHabitVoteCommentsRequestState}>
				<UI.ErrorBanner p="6" style={{alignSelf: "start"}}>
					Couldn't fetch vote comments.
				</UI.ErrorBanner>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitVoteCommentsRequestState}>
				{voteComments.length === 0 && (
					<UI.Text mt="24">Future vote comments will appear here.</UI.Text>
				)}
				{voteComments.length > 0 && (
					<>
						{voteComments.map(voteComment => (
							<HabitVoteComment key={voteComment.id} {...voteComment} />
						))}
					</>
				)}
			</Async.IfFulfilled>
		</>
	);
};

const HabitVoteComment: React.FC<IVoteComment> = ({day, habit_id, vote, comment}) => {
	const voteUrl = constructUrl("calendar", {
		preview_day: formatDay(day),
		highlighted_habit_id: habit_id?.toString(),
	});

	const formattedDay = formatDay(day);
	const formattedDayName = formatDayName(day);

	const voteToBadgeVariant = new Map<typeof vote, UI.BadgeVariant>();
	voteToBadgeVariant.set("progress", "positive");
	voteToBadgeVariant.set("plateau", "neutral");
	voteToBadgeVariant.set("regress", "negative");
	voteToBadgeVariant.set(null, "neutral");

	return (
		<UI.Field mt="24">
			<UI.Row mb="6" crossAxis="center">
				<UI.Label htmlFor={comment}>
					{formattedDay} ({formattedDayName})
				</UI.Label>
				<Link to={voteUrl}>
					<UI.Badge ml="6" variant={voteToBadgeVariant.get(vote) ?? "neutral"}>
						{vote ?? "NO VOTE"}
					</UI.Badge>
				</Link>
			</UI.Row>
			<UI.Textarea id={comment} value={comment} disabled />
		</UI.Field>
	);
};
