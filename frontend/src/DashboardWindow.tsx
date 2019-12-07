import * as Async from "react-async";
import React from "react";

import {AddHabitScoreboardItemForm} from "./AddHabitScoreboardItemForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitScoreboardItem} from "./interfaces/HabitScoreboardItem";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";

const performGetHabitScoreboardItemsRequest: Async.PromiseFn<HabitScoreboardItem[]> = () =>
	api
		.get<HabitScoreboardItem[]>("/habit-scoreboard-items")
		.then(response => response.data);

const performDeleteHabitScoreboardItemsRequest: Async.DeferFn<void> = ([
	id,
]: number[]) =>
	api.delete(`/habit-scoreboard-item/${id}`).then(response => response.data);

export const Dashboard = () => {
	const [
		idOfItemBeingCurrentlyDeleted,
		setIdOfItemBeingCurrentlyDeleted,
	] = React.useState<number | null>(null);

	const getHabitScoreboardItemsRequestState = Async.useAsync({
		promiseFn: performGetHabitScoreboardItemsRequest,
	});
	const {errorMessage: getListErrorMessage} = useRequestErrors(
		getHabitScoreboardItemsRequestState,
	);

	const deleteHabitScoreboardItemsRequestState = Async.useAsync({
		deferFn: performDeleteHabitScoreboardItemsRequest,
		onResolve: () => {
			getHabitScoreboardItemsRequestState.reload();
			setIdOfItemBeingCurrentlyDeleted(null);
		},
	});
	const {errorMessage: deleteItemErrorMessage} = useRequestErrors(
		deleteHabitScoreboardItemsRequestState,
	);

	return (
		<section className="flex flex-col items-center py-8">
			<AddHabitScoreboardItemForm
				refreshHabitScoreboardItemList={
					getHabitScoreboardItemsRequestState.reload
				}
			/>

			<Async.IfRejected state={getHabitScoreboardItemsRequestState}>
				<ErrorMessage className="mt-4 text-center">
					{getListErrorMessage}
				</ErrorMessage>
			</Async.IfRejected>

			<Async.IfRejected state={deleteHabitScoreboardItemsRequestState}>
				<ErrorMessage className="mt-4 text-center">
					{deleteItemErrorMessage}
				</ErrorMessage>
			</Async.IfRejected>

			<div
				className="mt-12 bg-white p-4"
				style={{
					display: "grid",
					gridTemplateColumns: "100px 440px 100px",
					gridTemplateRows: "auto",
					gridRowGap: "30px",
				}}
			>
				<Async.IfFulfilled state={getHabitScoreboardItemsRequestState}>
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
							<span className="pl-4 break-words pr-4">{item.name}</span>
							<button
								onClick={() => {
									setIdOfItemBeingCurrentlyDeleted(item.id);
									deleteHabitScoreboardItemsRequestState.run(item.id);
								}}
								type="button"
								className={`uppercase px-4 text-sm font-semibold text-red-500 inline`}
								disabled={deleteHabitScoreboardItemsRequestState.isPending}
							>
								{deleteHabitScoreboardItemsRequestState.isPending &&
								idOfItemBeingCurrentlyDeleted === item.id
									? "Loading"
									: "Delete"}
							</button>
						</>
					))}
				</Async.IfFulfilled>
			</div>
		</section>
	);
};
