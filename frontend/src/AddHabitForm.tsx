import {Dialog} from "@reach/dialog";
import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {PlusCircleIcon} from "./ui/icons/PlusCircle";
import {HabitNameInput} from "./HabitNameInput";
import {api} from "./services/api";
import {getRequestErrors, getRequestStateErrors} from "./selectors/getRequestErrors";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {useHabitsState} from "./contexts/habits-context";
import {useQueryParams} from "./hooks/useQueryParam";
import {useUserProfile} from "./contexts/auth-context";
import {Habit, NewHabitPayload, isHabitStrength, isHabitScore} from "./models";
import {usePersistentState} from "./hooks/usePersistentState";

export const AddHabitForm: React.FC = () => {
	const [profile] = useUserProfile();
	const getHabitsRequestState = useHabitsState();

	const [name, setName] = usePersistentState<NewHabitPayload["name"]>("habit_name", "");
	const [score, setScore] = usePersistentState<NewHabitPayload["score"]>("habit_score", "positive");
	const [strength, setStrength] = usePersistentState<NewHabitPayload["strength"]>(
		"habit_strength",
		"established",
	);
	const [description, setDescription] = usePersistentState<
		NonNullable<NewHabitPayload["description"]>
	>("habit_description", "");
	const [isTrackable, setIsTrackable] = usePersistentState<
		NonNullable<NewHabitPayload["is_trackable"]>
	>("habit_is_trackable", true);

	const triggerSuccessToast = useSuccessToast();
	const triggerUnexpectedErrorToast = useErrorToast();

	const [, updateQueryParams] = useQueryParams();

	const [addHabit, addHabitRequestState] = useMutation<Habit, NewHabitPayload>(api.habit.post, {
		onSuccess: () => {
			resetForm();
			getHabitsRequestState.refetch();
			triggerSuccessToast("Habit successfully addedd!");
		},
		onError: error => {
			const {responseStatus} = getRequestErrors(error as Error);
			if (responseStatus === 500) {
				triggerUnexpectedErrorToast("Habit couldn't be added.");
			}
		},
	});

	const {getArgErrorMessage, errorMessage} = getRequestStateErrors(addHabitRequestState);
	const nameInlineErrorMessage = getArgErrorMessage("name");
	const descriptionInlineErrorMessage = getArgErrorMessage("description");

	function hideAddFormDialog() {
		updateQueryParams("habits", {});
	}

	function safeSetScore(event: React.ChangeEvent<HTMLSelectElement>) {
		if (isHabitScore(event.target.value)) {
			setScore(event.target.value);
		}
	}

	function safeSetStrength(event: React.ChangeEvent<HTMLSelectElement>) {
		if (isHabitStrength(event.target.value)) {
			setStrength(event.target.value);
		}
	}

	function resetForm() {
		setName("");
		setScore("positive");
		setStrength("established");
		setDescription("");
		setIsTrackable(true);
	}

	return (
		<Dialog
			data-width="view-l"
			data-lg-width="auto"
			data-lg-mx="12"
			data-pt="12"
			data-pb="24"
			data-lg-mt="12"
			aria-label="Add new habit"
			onDismiss={hideAddFormDialog}
		>
			<UI.Row bg="gray-1" p={["24", "6"]} mainAxis="between">
				<UI.Header variant="small">New habit</UI.Header>
				<UI.CloseIcon onClick={hideAddFormDialog} />
			</UI.Row>

			<UI.Column
				as="form"
				p="12"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					addHabit({
						name,
						score,
						strength,

						// If profile.id happens to be 0,
						// the request will fail.
						user_id: profile?.id ?? 0,
						description: description ?? null,
						is_trackable: isTrackable,
					});
				}}
			>
				<UI.Row wrap="wrap" mt={["48", "0"]}>
					<UI.Field style={{flexGrow: 1}} mr="12" mt={[, "12"]}>
						<UI.Label htmlFor="name">Habit name</UI.Label>
						<HabitNameInput
							id="name"
							value={name}
							onChange={event => setName(event.target.value)}
						/>
					</UI.Field>

					<UI.Field mr="12" mt={[, "12"]}>
						<UI.Label htmlFor="score">Score</UI.Label>
						<UI.Select
							id="score"
							name="score"
							required
							value={score}
							onChange={safeSetScore}
							onBlur={safeSetScore}
						>
							<option value="positive">positive</option>
							<option value="neutral">neutral</option>
							<option value="negative">negative</option>
						</UI.Select>
					</UI.Field>

					<UI.Field mt={[, "12"]}>
						<UI.Label htmlFor="strength">Strength</UI.Label>
						<UI.Select
							id="strength"
							name="strength"
							required
							value={strength}
							onChange={safeSetStrength}
							onBlur={safeSetStrength}
						>
							<option value="established">established</option>
							<option value="developing">developing</option>
							<option value="fresh">fresh</option>
						</UI.Select>
					</UI.Field>
				</UI.Row>

				<UI.ShowIf request={addHabitRequestState} is="error">
					<UI.Error mt="6">{nameInlineErrorMessage}</UI.Error>
				</UI.ShowIf>

				<UI.Row crossAxis="center" wrap={[, "wrap"]}>
					<UI.Field variant="row" mr="24" mt={["48", "24"]}>
						<UI.Checkbox
							id="is_trackable"
							name="is_trackable"
							checked={Boolean(isTrackable)}
							onChange={() => setIsTrackable(!isTrackable)}
						/>
						<UI.Label ml="6" htmlFor="is_trackable">
							Track this habit
						</UI.Label>
					</UI.Field>

					<UI.InfoBanner size="small" mt={["48", "24"]}>
						You won't be able to vote for an untracked habit.
					</UI.InfoBanner>
				</UI.Row>

				<UI.Field mt="24">
					<UI.Label htmlFor="description">Description</UI.Label>
					<UI.Textarea
						id="description"
						value={String(description)}
						onChange={event => setDescription(event.target.value)}
						name="description"
						placeholder="Write something..."
					/>
				</UI.Field>

				<UI.ShowIf request={addHabitRequestState} is="error">
					<UI.Error mt="6">{descriptionInlineErrorMessage}</UI.Error>
				</UI.ShowIf>

				<UI.Row mt="48" mb="24" mainAxis="end">
					<UI.Button variant="outlined" onClick={resetForm}>
						Reset form
					</UI.Button>

					<UI.Button
						style={{width: "125px"}}
						ml="24"
						variant="primary"
						layout="with-icon"
						type="submit"
					>
						<PlusCircleIcon mr="auto" />
						Add habit
					</UI.Button>
				</UI.Row>

				<UI.ShowIf request={addHabitRequestState} is="error">
					<UI.ErrorBanner size="big">
						{errorMessage || "Something unexpected happened. Please try again later."}
					</UI.ErrorBanner>
				</UI.ShowIf>
			</UI.Column>
		</Dialog>
	);
};
