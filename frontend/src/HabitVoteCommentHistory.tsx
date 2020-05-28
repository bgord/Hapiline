import {Link} from "react-router-dom";
import {useQuery} from "react-query";
import React from "react";

import * as UI from "./ui";
import {Habit, HabitVote} from "./interfaces/index";
import {api} from "./services/api";
import {constructUrl} from "./hooks/useQueryParam";
import {formatDay, formatDayName} from "./config/DATE_FORMATS";
import {useErrorToast} from "./contexts/toasts-context";

export const HabitVoteCommentHistory: React.FC<{habitId: Habit["id"]}> = ({habitId}) => {
	const triggerErrorNotification = useErrorToast();

	const getHabitVoteCommentsRequestState = useQuery<HabitVote[], ["comments", Habit["id"]]>({
		queryKey: ["comments", habitId],
		queryFn: api.habit.getHabitVoteComments,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch vote comments."),
			retry: false,
		},
	});

	const voteComments = getHabitVoteCommentsRequestState?.data ?? [];

	return (
		<>
			<UI.Header mt="48" mb="24" variant="extra-small">
				Vote comments
			</UI.Header>

			{getHabitVoteCommentsRequestState.status === "error" && (
				<UI.ErrorBanner crossAxisSelf="start">Couldn't fetch vote comments.</UI.ErrorBanner>
			)}

			{getHabitVoteCommentsRequestState.status === "success" && (
				<>
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
				</>
			)}
		</>
	);
};

const HabitVoteComment: React.FC<HabitVote> = ({day, habit_id, vote, comment}) => {
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
				<UI.Label htmlFor={comment ?? undefined}>
					{formattedDay} ({formattedDayName})
				</UI.Label>
				<Link to={voteUrl}>
					<UI.Badge ml="6" variant={voteToBadgeVariant.get(vote) ?? "neutral"}>
						{vote ?? "NO VOTE"}
					</UI.Badge>
				</Link>
			</UI.Row>
			<UI.Textarea id={comment ?? undefined} value={comment ?? undefined} disabled />
		</UI.Field>
	);
};
