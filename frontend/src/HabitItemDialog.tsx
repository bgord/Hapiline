import {Dialog} from "@reach/dialog";
import {useQuery, useMutation} from "react-query";
import React from "react";

import {
	CancelButton,
	SaveButton,
	useEditableFieldValue,
	useEditableFieldState,
} from "./hooks/useEditableField";
import * as UI from "./ui";
import {DeleteHabitButton} from "./DeleteHabitButton";
import {EditableHabitNameInput} from "./EditableHabitNameInput";
import {EditableHabitScoreSelect} from "./EditableHabitScoreSelect";
import {EditableHabitStrengthSelect} from "./EditableHabitStrengthSelect";
import {HabitCharts} from "./HabitCharts";
import {HabitVoteCommentHistory} from "./HabitVoteCommentHistory";
import {Habit, DetailedHabit, DraftHabitPayload} from "./models";
import {api} from "./services/api";
import {formatTime} from "./services/date-formatter";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";
import {pluralize} from "./services/pluralize";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

interface HabitItemDialogProps {
	habitId: Habit["id"];
	closeDialog: VoidFunction;
}

export const HabitItemDialog: React.FC<HabitItemDialogProps> = ({habitId, closeDialog}) => {
	useDocumentTitle("Hapiline - habit preview");
	const getHabitsRequestState = useHabitsState();

	const mediaQuery = useMediaQuery();

	const triggerErrorToast = useErrorToast();

	const habitRequestState = useQuery<DetailedHabit, ["single_habit", Habit["id"]]>({
		queryKey: ["single_habit", habitId],
		queryFn: api.habit.show,
		config: {
			onError: () => triggerErrorToast("Fetching task details failed."),
			retry: false,
		},
	});

	const habit = habitRequestState?.data as DetailedHabit;

	function dismissDialog() {
		closeDialog();
		getHabitsRequestState.refetch();
	}

	return (
		<Dialog
			onDismiss={dismissDialog}
			data-width="view-l"
			data-lg-width="auto"
			data-lg-mx="6"
			data-lg-mt="12"
			data-mb="0"
			data-overflow="auto"
			aria-label="Show habit preview"
			style={{maxHeight: mediaQuery === MEDIA_QUERY.default ? "calc(90vh - 48px)" : "95vh"}}
		>
			<UI.Column>
				<UI.Row bg="gray-1" p={["24", "6"]} mainAxis="between">
					<UI.Header variant="small">Habit preview</UI.Header>
					<UI.CloseIcon onClick={dismissDialog} />
				</UI.Row>

				<UI.ShowIf request={habitRequestState} is="loading">
					<UI.Text ml="24" mt="48">
						Loading details...
					</UI.Text>
				</UI.ShowIf>

				<UI.ShowIf request={habitRequestState} is="error">
					<UI.ErrorBanner m="24">Couldn't fetch task details, please try again.</UI.ErrorBanner>
				</UI.ShowIf>

				{habit?.id && (
					<UI.Column px={["24", "12"]}>
						<UI.Row wrap={[, "wrap"]} crossAxis="end" width="100%">
							<UI.Row mr="6" mt="24">
								<EditableHabitNameInput {...habit} key={habit?.name} />
							</UI.Row>

							<EditableHabitScoreSelect {...habit} key={habit?.score} />

							<EditableHabitStrengthSelect {...habit} key={habit?.strength} />
						</UI.Row>

						{!habit.is_trackable && (
							<UI.Row mt="24">
								<UI.Badge variant="neutral">Untracked</UI.Badge>
								<UI.InfoBanner size="small" ml="24">
									You cannot vote for an untracked habit.
								</UI.InfoBanner>
							</UI.Row>
						)}
						<UI.Column mt="48">
							{habit.is_trackable && (
								<HabitCharts id={habit.id}>
									<UI.Badge mt="12" hidden={!habit.progress_streak} variant="positive">
										{habit.progress_streak} {pluralize("day", habit.progress_streak ?? 0)} progress
										streak
									</UI.Badge>
									<UI.Badge mt="12" hidden={!habit.regress_streak} variant="negative">
										{habit.regress_streak} {pluralize("day", habit.regress_streak ?? 0)} regress
										streak
									</UI.Badge>
									<UI.Badge
										mt="12"
										hidden={Boolean(habit.regress_streak || habit.progress_streak)}
										variant="neutral"
									>
										No streak today
									</UI.Badge>
								</HabitCharts>
							)}
							<UI.Column mt="24">
								<EditableDescription
									description={habit.description}
									habitId={habit.id}
									onResolve={habitRequestState.refetch}
								/>
							</UI.Column>

							{habit.is_trackable && <HabitVoteCommentHistory habitId={habit.id} />}

							<UI.Row mt="12" mb="48" mainAxis="between" crossAxis="end" wrap={[, "wrap"]}>
								<UI.Wrapper>
									<UI.Text variant="dimmed" mr="6" mt="24">
										Created at:
									</UI.Text>
									<UI.Text variant="monospaced" mr="24">
										{formatTime(habit.created_at)}
									</UI.Text>
								</UI.Wrapper>

								<UI.Wrapper>
									<UI.Text variant="dimmed" mr="6" mt="12">
										Last update:
									</UI.Text>
									<UI.Text variant="monospaced">{formatTime(habit.updated_at)}</UI.Text>
								</UI.Wrapper>

								<DeleteHabitButton {...habit} />
							</UI.Row>
						</UI.Column>
					</UI.Column>
				)}
			</UI.Column>
		</Dialog>
	);
};

const EditableDescription: React.FC<{
	description: Habit["description"];
	habitId: Habit["id"];
	onResolve: VoidFunction;
}> = ({description, habitId, onResolve}) => {
	const textarea = useEditableFieldState();

	const triggerSuccessToast = useSuccessToast();
	const triggerErrorToast = useErrorToast();

	const [updateHabitDescription, updateHabitDescriptionRequestState] = useMutation<
		DetailedHabit,
		DraftHabitPayload
	>(api.habit.patch, {
		onSuccess: () => {
			triggerSuccessToast("Comment added successfully!");
			textarea.setIdle();
			onResolve();
		},
		onError: () => triggerErrorToast("Habit description couldn't be changed"),
	});

	const [newDescription, newDescriptionHelpers] = useEditableFieldValue(
		updateDescription =>
			updateHabitDescription({
				id: habitId,
				description: updateDescription,
			}),
		description,
	);

	const {getArgErrorMessage} = getRequestStateErrors(updateHabitDescriptionRequestState);
	const descriptionInlineErrorMessage = getArgErrorMessage("description");

	return (
		<>
			<UI.Field mt="24" mb="12">
				<UI.Label htmlFor="description">Description</UI.Label>
				<UI.Textarea
					id="description"
					onFocus={textarea.setFocused}
					placeholder="Write something..."
					value={newDescription ?? undefined}
					onChange={newDescriptionHelpers.onChange}
				/>
			</UI.Field>

			{updateHabitDescriptionRequestState.status === "error" && (
				<UI.Error>{descriptionInlineErrorMessage}</UI.Error>
			)}

			<UI.Row>
				<SaveButton {...textarea} onClick={newDescriptionHelpers.onUpdate}>
					Save
				</SaveButton>
				<CancelButton {...textarea} onClick={newDescriptionHelpers.onClear}>
					Cancel
				</CancelButton>
			</UI.Row>
		</>
	);
};
