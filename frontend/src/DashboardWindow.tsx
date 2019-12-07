import * as Async from "react-async";
import React from "react";

import {CloseableSuccessMessage} from "./SuccessMessages";
import {ErrorMessage} from "./ErrorMessages";
import {Loader} from "./Loader";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {useUserProfile} from "./contexts/auth-context";

interface HabitScoreboardItem {
	id: number;
	name: string;
	score: "positive" | "neutral" | "negative";
}

const performAddHabitScoreboardItemRequest: Async.DeferFn<HabitScoreboardItem> = ([
	name,
	score,
	user_id,
]: string[]) =>
	api
		.post<HabitScoreboardItem>("/habit-scoreboard-item", {
			name,
			score,
			user_id,
		})
		.then(response => response.data);

const performGetHabitScoreboardItemsRequest: Async.PromiseFn<HabitScoreboardItem[]> = () =>
	api
		.get<HabitScoreboardItem[]>("/habit-scoreboard-items")
		.then(response => response.data);

export const Dashboard = () => {
	const [name, setName] = React.useState("");
	const [score, setScore] = React.useState("neutral");
	const [profile] = useUserProfile();

	const getHabitScoreboardItemsRequestState = Async.useAsync({
		promiseFn: performGetHabitScoreboardItemsRequest,
	});

	const addHabitScoreboardItemRequestState = Async.useAsync({
		deferFn: performAddHabitScoreboardItemRequest,
		onResolve: function clearForm() {
			setName("");
			setScore("neutral");

			getHabitScoreboardItemsRequestState.reload();
		},
	});
	const {getArgError, errorMessage} = useRequestErrors(
		addHabitScoreboardItemRequestState,
	);
	const nameInlineError = getArgError("name");

	const {errorMessage: getErrorMessage} = useRequestErrors(
		getHabitScoreboardItemsRequestState,
	);

	return (
		<section className="flex flex-col items-center py-8">
			<div>
				<form
					onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
						event.preventDefault();
						addHabitScoreboardItemRequestState.run(name, score, profile?.id);
					}}
					className="flex items-end"
				>
					<div className="flex flex-col">
						<label className="field-label" htmlFor="name">
							Habit
						</label>
						<input
							required
							pattern=".{1,255}"
							title="Please, try to fit habit in 255 characters."
							className="field w-64"
							id="name"
							name="name"
							value={name}
							type="text"
							onChange={event => setName(event.target.value)}
							placeholder="Wake up at 7:30 AM"
						/>
					</div>
					<div className="flex flex-col ml-8">
						<label className="field-label" htmlFor="score">
							Score
						</label>
						<select
							id="score"
							name="score"
							required
							value={score}
							onChange={event => setScore(event.target.value)}
							className="field bg-white"
						>
							<option value="neutral">Neutral</option>
							<option value="positive">Positive</option>
							<option value="negative">Negative</option>
						</select>
					</div>
					<button className="btn btn-blue ml-8 h-10" type="submit">
						Add habit
					</button>
				</form>
				<Async.IfFulfilled state={addHabitScoreboardItemRequestState}>
					<CloseableSuccessMessage>
						Habit successfully addedd!
					</CloseableSuccessMessage>
				</Async.IfFulfilled>
				<Async.IfRejected state={addHabitScoreboardItemRequestState}>
					<ErrorMessage className="mt-4">
						{nameInlineError?.message || errorMessage}
					</ErrorMessage>
				</Async.IfRejected>
			</div>
			<Async.IfPending state={getHabitScoreboardItemsRequestState}>
				<Loader />
			</Async.IfPending>

			<Async.IfRejected state={getHabitScoreboardItemsRequestState}>
				<ErrorMessage className="mt-4">{getErrorMessage}</ErrorMessage>
			</Async.IfRejected>

			<Async.IfFulfilled state={getHabitScoreboardItemsRequestState}>
				<div
					className="mt-12 bg-white p-4"
					style={{
						display: "grid",
						gridTemplateColumns: "100px 440px",
						gridTemplateRows: "auto",
						gridRowGap: "30px",
					}}
				>
					{!getHabitScoreboardItemsRequestState?.data?.length && (
						<div className="text-center" style={{gridColumn: "span 2"}}>
							Seems you haven't added any habits yet.
						</div>
					)}
					{getHabitScoreboardItemsRequestState?.data?.map(item => (
						<>
							<span
								style={{
									placeSelf: "center",
								}}
								className="bg-gray-300 w-full text-center"
							>
								{item.score}
							</span>
							<span className="pl-4 10px">{item.name}</span>
						</>
					))}
				</div>
			</Async.IfFulfilled>
		</section>
	);
};
