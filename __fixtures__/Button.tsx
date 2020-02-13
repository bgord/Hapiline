import React from "react";
import {Demo} from "./_Demo";
import {Button} from "../frontend/src/ui/button/Button";

export default {
	"--normal": (
		<Demo>
			<Button variant="normal">Reset filters</Button>
			<Button variant="normal" style={{marginLeft: "25px"}} disabled>
				Reset filters
			</Button>
		</Demo>
	),
};
