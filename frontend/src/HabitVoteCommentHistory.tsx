import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Field, Header, Label, Textarea, Text, ErrorBanner, Badge, BadgeVariant, Row} from "./ui";
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
		<div>
			<Header mt="48" mb="24" variant="extra-small">
				Vote comments
			</Header>
			<Async.IfRejected state={getHabitVoteCommentsRequestState}>
				<ErrorBanner>Couldn't fetch vote comments.</ErrorBanner>
			</Async.IfRejected>
			<Async.IfFulfilled state={getHabitVoteCommentsRequestState}>
				{voteComments.length === 0 && <Text mt="24">Future vote comments will appear here.</Text>}
				{voteComments.length > 0 && (
					<>
						{voteComments.map(voteComment => (
							<HabitVoteComment key={voteComment.id} {...voteComment} />
						))}
					</>
				)}
			</Async.IfFulfilled>
		</div>
	);
};

const HabitVoteComment: React.FC<IVoteComment> = ({day, habit_id, vote, comment}) => {
	const voteUrl = constructUrl("calendar", {
		preview_day: formatDay(day),
		highlighted_habit_id: habit_id?.toString(),
	});

	const formattedDay = formatDay(day);
	const formattedDayName = formatDayName(day);

	const voteToBadgeVariant = new Map<typeof vote, BadgeVariant>();
	voteToBadgeVariant.set("progress", "positive");
	voteToBadgeVariant.set("plateau", "neutral");
	voteToBadgeVariant.set("regress", "negative");
	voteToBadgeVariant.set(null, "neutral");

	return (
		<Field mt="24">
			<Row mb="6" crossAxis="center">
				<Label htmlFor={comment}>
					{formattedDay} ({formattedDayName})
				</Label>
				<Link to={voteUrl}>
					<Badge ml="6" variant={voteToBadgeVariant.get(vote) ?? "neutral"}>
						{vote ?? "NO VOTE"}
					</Badge>
				</Link>
			</Row>
			<Textarea id={comment} value={comment} disabled />
		</Field>
	);
};
