import * as Async from "react-async";
import React from "react";

import {AddHabitScoreboardItemForm} from "./AddHabitScoreboardItemForm";
import {ErrorMessage} from "./ErrorMessages";
import {HabitScoreboardItem} from "./interfaces/HabitScoreboardItem";
import {Loader} from "./Loader";
import {api} from "./services/api";
import {useRequestErrors} from "./hooks/useRequestErrors";

const performGetHabitScoreboardItemsRequest: Async.PromiseFn<HabitScoreboardItem[]> = () =>
	api
		.get<HabitScoreboardItem[]>("/habit-scoreboard-items")
		.then(response => response.data);

export const Dashboard = () => {
	const getHabitScoreboardItemsRequestState = Async.useAsync({
		promiseFn: performGetHabitScoreboardItemsRequest,
	});
	const {errorMessage} = useRequestErrors(getHabitScoreboardItemsRequestState);

	return (
		<section className="flex flex-col items-center py-8">
			<AddHabitScoreboardItemForm
				refreshHabitScoreboardItemList={
					getHabitScoreboardItemsRequestState.reload
				}
			/>
			<Async.IfPending state={getHabitScoreboardItemsRequestState}>
				<Loader />
			</Async.IfPending>

			<Async.IfRejected state={getHabitScoreboardItemsRequestState}>
				<ErrorMessage className="mt-4">{errorMessage}</ErrorMessage>
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
