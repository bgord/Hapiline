import React from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import {DeleteHabitButton} from "./DeleteHabitButton";
import {HabitItemDialog} from "./HabitItemDialog";
import {IHabit} from "./interfaces/IHabit";

export const scoreToBgColor: {[key in IHabit["score"]]: string} = {
	positive: "bg-green-300",
	neutral: "bg-gray-300",
	negative: "bg-red-300",
};

interface Props {
	habits: IHabit[];
	refreshList: VoidFunction;
}

export const HabitList: React.FC<Props> = ({habits, refreshList}) => {
	return (
		<DragDropContext onDragEnd={() => console.log("drag'n'drop'd")}>
			<Droppable droppableId="habits">
				{provided => (
					<ul
						ref={provided.innerRef}
						{...provided.droppableProps}
						className="flex flex-col mt-12 bg-white p-4 pb-0 max-w-2xl w-full"
					>
						{habits.map((habit, index) => {
							const [showDialog, setShowDialog] = React.useState(false);

							const openDialog = () => setShowDialog(true);
							const closeDialog = () => setShowDialog(false);

							return (
								<Draggable
									key={habit.id}
									draggableId={habit.id.toString()}
									index={index}
								>
									{provided => (
										<li
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="flex items-baseline mb-4"
											key={habit.id}
										>
											<div
												className={`${
													scoreToBgColor[habit.score]
												} w-20 pl-1 p-2 text-center`}
											>
												{habit.score}
											</div>
											<div className="flex justify-between w-full">
												<div className="p-2 bg-gray-100 ml-2 w-full">
													{habit.name}
												</div>
												<div className="flex ml-4">
													<button className="uppercase" onClick={openDialog}>
														more
													</button>
													<DeleteHabitButton
														{...habit}
														refreshList={refreshList}
													/>
												</div>
											</div>
											{showDialog && (
												<HabitItemDialog
													habitId={habit.id}
													closeDialog={closeDialog}
													refreshList={refreshList}
												/>
											)}
										</li>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	);
};
