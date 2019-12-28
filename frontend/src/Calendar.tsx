import {Dialog} from "@reach/dialog";
import React from "react";
import useHover from "@react-hook/hover";

import {CloseButton} from "./CloseButton";
import {MonthDayProps, useMonthsWidget} from "./hooks/useMonthsWidget";
import {useDialog} from "./hooks/useDialog";

export const Calendar: React.FC = () => {
	const [widget, date] = useMonthsWidget();

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "repeat(7, 200px)",
		gridTemplateRows: "repeat(6, 120px)",
		gridGap: "3px",
	};

	return (
		<section className="flex flex-col items-center p-8 mx-auto">
			<div className="flex mb-16">
				<button
					className="px-2"
					type="button"
					onClick={widget.setPreviousMonth}
				>
					Previous
				</button>
				<div className="mx-8 w-32">{date}</div>
				<button className="px-2" type="button" onClick={widget.setNextMonth}>
					Next
				</button>
			</div>
			<ul style={habitDialogGrid}>
				{widget.givenMonthDays.map(props => (
					<Day key={props.day.toString()} {...props} />
				))}
			</ul>
		</section>
	);
};

const Day: React.FC<MonthDayProps> = ({day, styles}) => {
	const [isHovering, ref] = useHover();
	const [showDialog, openDialog, closeDialog] = useDialog();

	return (
		<>
			<li
				className="flex flex-col align-center bg-green-100 hover:bg-green-200"
				style={styles}
				ref={ref as React.Ref<HTMLLIElement>}
			>
				<span className="text-center w-full pt-2">{day}</span>
				{isHovering && (
					<button
						type="button"
						className="mt-2 py-1 uppercase"
						onClick={openDialog}
					>
						show day
					</button>
				)}
			</li>
			{showDialog && (
				<Dialog aria-label="Show day preview">
					<div className="flex justify-between items-baseline">
						<strong>{day}</strong>
						<CloseButton onClick={closeDialog} />
					</div>
				</Dialog>
			)}
		</>
	);
};
