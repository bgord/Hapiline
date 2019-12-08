import * as Async from "react-async";
import React from "react";

import {AddHabitScoreboardItemForm} from "./AddHabitScoreboardItemForm";
import {DeleteButton} from "./DeleteHabitScoreboardItemButton";
import {ErrorMessage} from "./ErrorMessages";
import {HabitScoreboardItem} from "./interfaces/HabitScoreboardItem";
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
	const {errorMessage: getListErrorMessage} = useRequestErrors(
		getHabitScoreboardItemsRequestState,
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
							<DeleteButton
								refreshList={getHabitScoreboardItemsRequestState.reload}
								id={item.id}
							/>
						</>
					))}
				</Async.IfFulfilled>
			</div>
		</section>
	);
};
