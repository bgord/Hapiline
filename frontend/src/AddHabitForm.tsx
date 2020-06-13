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

export const AddHabitForm: React.FC = () => {
	const [profile] = useUserProfile();
	const getHabitsRequestState = useHabitsState();

	const [name, setName] = React.useState<NewHabitPayload["name"]>("");
	const [score, setScore] = React.useState<NewHabitPayload["score"]>("positive");
	const [strength, setStrength] = React.useState<NewHabitPayload["strength"]>("established");
	const [description, setDescription] = React.useState<NewHabitPayload["description"]>("");
	const [isTrackable, setIsTrackable] = React.useState<NewHabitPayload["is_trackable"]>(true);

	const triggerSuccessToast = useSuccessToast();
	const triggerUnexpectedErrorToast = useErrorToast();

	const [, updateQueryParams] = useQueryParams();

	const [addHabit, addHabitRequestState] = useMutation<Habit, NewHabitPayload>(api.habit.post, {
		onSuccess: () => {
			setName("");
			setScore("positive");
			setStrength("established");
			setDescription("");
			setIsTrackable(true);

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

	return (
		<Dialog data-pt="12" data-pb="48" aria-label="Add new habit" onDismiss={hideAddFormDialog}>
			<UI.Row bg="gray-1" p="24" mainAxis="between">
				<UI.Header variant="small">New habit</UI.Header>
				<UI.CloseIcon onClick={hideAddFormDialog} />
			</UI.Row>

			<UI.Column
				as="form"
				p="24"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					addHabit({
						name,
						score,
						strength,
						user_id: profile?.id || 0,
						description: description || null,
						is_trackable: isTrackable,
					});
				}}
			>
				<UI.Row mt="48">
					<UI.Field style={{flexGrow: 1}}>
						<UI.Label htmlFor="name">Habit name</UI.Label>
						<HabitNameInput
							id="name"
							value={name}
							onChange={event => setName(event.target.value)}
						/>
					</UI.Field>
					<UI.Field ml="12">
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
					<UI.Field ml="12">
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

				<UI.Row mt="48" crossAxis="center">
					<UI.Field variant="row">
						<UI.Checkbox
							id="is_trackable"
							name="is_trackable"
							checked={Boolean(isTrackable)}
							onChange={() => setIsTrackable(v => !v)}
						/>
						<UI.Label ml="6" htmlFor="is_trackable">
							Track this habit
						</UI.Label>
					</UI.Field>

					<UI.InfoBanner size="small" ml="24">
						You won't be able to vote for an untracked habit.
					</UI.InfoBanner>
				</UI.Row>

				<UI.Field mt="24">
					<UI.Label htmlFor="description">Description</UI.Label>
					<UI.Textarea
						value={String(description)}
						onChange={event => setDescription(event.target.value)}
						name="description"
						placeholder="Write something..."
					/>
				</UI.Field>

				<UI.ShowIf request={addHabitRequestState} is="error">
					<UI.Error mt="6">{descriptionInlineErrorMessage}</UI.Error>
				</UI.ShowIf>

				<UI.Button
					style={{width: "125px"}}
					ml="auto"
					mt="48"
					mb="24"
					variant="primary"
					layout="with-icon"
					type="submit"
				>
					<PlusCircleIcon mr="auto" />
					Add habit
				</UI.Button>

				<UI.ShowIf request={addHabitRequestState} is="error">
					<UI.ErrorBanner size="big">
						{errorMessage || "Something unexpected happened. Please try again later."}
					</UI.ErrorBanner>
				</UI.ShowIf>
			</UI.Column>
		</Dialog>
	);
};
