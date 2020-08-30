import {Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import {subDays, isBefore} from "date-fns";
import {
	HabitVoteType,
	habitStrengthToBadgeVariant,
	HabitWithPossibleHabitVote,
	HabitVotePayload,
	HabitVote,
	HabitVoteCommentPayload,
} from "./models";
import * as UI from "./ui";
import {api} from "./services/api";
import {useEditableFieldValue} from "./hooks/useEditableField";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useToggle} from "./hooks/useToggle";
import {UrlBuilder} from "./services/url-builder";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export function DayDialogHabitVoteListItem({
	onResolve,
	day,
	...habitWithPossibleVote
}: HabitWithPossibleHabitVote & {
	onResolve: VoidFunction;
	day: string;
}) {
	const {on: isCommentVisible, toggle: toggleComment} = useToggle();

	const mediaQuery = useMediaQuery();

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const currentVoteType = habitWithPossibleVote.vote?.vote;

	const [addHabitDayVote, addHabitDayVoteRequestState] = useMutation<HabitVote, HabitVotePayload>(
		api.habit.addHabitDayVote,
		{
			onSuccess: () => {
				triggerSuccessToast("Habit vote added successfully!");
				onResolve();
			},

			onError: () => triggerErrorToast("Error while changing habit vote."),
		},
	);

	const upsertCommentResponseHandlers = {
		onSuccess: () => {
			triggerSuccessToast("Comment added successfully!");
			onResolve();
		},
		onError: () => triggerErrorToast("Couldn't add comment"),
	};

	const [updateVoteComment] = useMutation<HabitVote, HabitVoteCommentPayload>(
		api.habit.updateVoteComment,
		upsertCommentResponseHandlers,
	);

	const [addEmptyHabitDayVote] = useMutation<HabitVote, HabitVotePayload>(
		api.habit.addHabitDayVote,
		upsertCommentResponseHandlers,
	);

	const [newComment, newCommentHelpers] = useEditableFieldValue({
		updateFn: changedComment => {
			if (habitWithPossibleVote.vote?.id) {
				updateVoteComment({id: habitWithPossibleVote.vote.id, comment: changedComment});
			} else {
				addEmptyHabitDayVote({
					day: new Date(day),
					habit_id: habitWithPossibleVote.id,
					vote: null,
					comment: changedComment,
				});
			}
		},
		defaultValue: habitWithPossibleVote.vote?.comment,
		allowEmptyString: true,
	});

	const weekAgo = subDays(new Date(), 7);
	const isAddingVotesAllowed = isBefore(new Date(day), weekAgo);

	const comment = habitWithPossibleVote.vote?.comment ?? null;

	function changeVote(type: NonNullable<HabitVoteType>) {
		addHabitDayVote({
			day: new Date(day),
			habit_id: habitWithPossibleVote.id,
			vote: currentVoteType === type ? null : type,
			comment: habitWithPossibleVote.vote?.comment ?? null,
		});
	}

	const isVoteCommentPristine = comment === newComment || (!comment && !newComment);

	return (
		<>
			<UI.Row as="li" pb="12" width="100%" by="gray-1">
				<UI.Column width="100%">
					<UI.Row pt="6" width="100%" mr="6" wrap={[, "wrap"]}>
						<UI.Row width="auto" style={{marginLeft: mediaQuery === MEDIA_QUERY.lg ? "-6px" : "0"}}>
							{isCommentVisible && (
								<UI.Button variant="bare" title="Hide vote comment" onClick={toggleComment}>
									<UI.VisuallyHidden>Hide vote comment</UI.VisuallyHidden>
									<UI.ChevronUpIcon />
								</UI.Button>
							)}

							{!isCommentVisible && (
								<UI.Button
									variant="bare"
									title="Show and edit vote comment"
									onClick={toggleComment}
								>
									<UI.VisuallyHidden>Show and edit vote comment</UI.VisuallyHidden>
									<UI.ChevronDownIcon />
								</UI.Button>
							)}

							<UI.Text
								as={Link}
								to={UrlBuilder.habits.preview(habitWithPossibleVote.id)}
								variant="semi-bold"
							>
								{habitWithPossibleVote.name}
							</UI.Text>
						</UI.Row>

						<UI.Row ml="auto" width="auto">
							<UI.Button
								bg={currentVoteType === "progress" ? "green" : "gray-0"}
								style={{
									color: currentVoteType === "progress" ? "var(--green-dark)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								variant="bare"
								onClick={() => changeVote("progress")}
								disabled={addHabitDayVoteRequestState.status === "loading" || isAddingVotesAllowed}
							>
								<UI.VisuallyHidden>Add progress vote</UI.VisuallyHidden>
								<UI.SmallPlusIcon />
							</UI.Button>
							<UI.Button
								bg={currentVoteType === "plateau" ? "gray-2" : "gray-0"}
								style={{
									color: currentVoteType === "plateau" ? "var(--gray-9)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("plateau")}
								disabled={addHabitDayVoteRequestState.status === "loading" || isAddingVotesAllowed}
							>
								<UI.VisuallyHidden>Add plateau vote</UI.VisuallyHidden>
								<UI.SmallEqualsSign />
							</UI.Button>
							<UI.Button
								bg={currentVoteType === "regress" ? "red" : "gray-0"}
								style={{
									color: currentVoteType === "regress" ? "var(--red-dark)" : "var(--gray-10)",
									borderRadius: "var(--radius-half)",
								}}
								ml="6"
								variant="bare"
								onClick={() => changeVote("regress")}
								disabled={addHabitDayVoteRequestState.status === "loading" || isAddingVotesAllowed}
							>
								<UI.VisuallyHidden>Add regress vote</UI.VisuallyHidden>
								<UI.SmallMinusIcon />
							</UI.Button>
						</UI.Row>
					</UI.Row>

					<UI.Row mt="6" wrap={[, "wrap"]}>
						<UI.Badge mt="6" ml={["48", "3"]} mr="6" variant={habitWithPossibleVote.score}>
							{habitWithPossibleVote.score}
						</UI.Badge>
						<UI.Badge
							mt="6"
							ml="6"
							mr="12"
							variant={habitStrengthToBadgeVariant[habitWithPossibleVote.strength]}
						>
							{habitWithPossibleVote.strength}
						</UI.Badge>
						{!currentVoteType && (
							<UI.Badge mt="6" ml={["auto", "3"]} variant="neutral" mr="6">
								No vote yet
							</UI.Badge>
						)}
					</UI.Row>

					{isCommentVisible && (
						<UI.Column mt="24" pl={["48", "6"]}>
							<UI.Field mb="12">
								<UI.Label htmlFor="vote_comment">Vote comment</UI.Label>
								<UI.Textarea
									id="vote_comment"
									disabled={isAddingVotesAllowed}
									key={habitWithPossibleVote.vote?.comment ?? undefined}
									placeholder="Write something..."
									value={newComment ?? undefined}
									onChange={newCommentHelpers.onChange}
								/>
							</UI.Field>
							<UI.Row mb="12">
								<UI.Button
									disabled={isVoteCommentPristine || isAddingVotesAllowed}
									variant="primary"
									onClick={newCommentHelpers.onUpdate}
									mr="6"
								>
									Save
								</UI.Button>

								<UI.Button
									disabled={isVoteCommentPristine || isAddingVotesAllowed}
									variant="outlined"
									onClick={newCommentHelpers.onClear}
								>
									Cancel
								</UI.Button>
							</UI.Row>
						</UI.Column>
					)}
				</UI.Column>
			</UI.Row>
		</>
	);
}
