import {format} from "date-fns";
import {useHistory} from "react-router-dom";
import React from "react";

import {BareButton} from "./BareButton";

export const DashboardWindow = () => {
	const history = useHistory();

	const today = new Date();
	const currentDate = format(today, "yyyy-MM-dd");

	return (
		<section className="flex max-w-2xl mx-auto mt-12">
			<header className="flex w-full">
				<h1 className="text-xl font-bold">Hello!</h1>
				<BareButton
					onClick={() => history.push(`/calendar?previewDay=${currentDate}`)}
					className="ml-auto bg-blue-300"
				>
					View today
				</BareButton>
			</header>
		</section>
	);
};
