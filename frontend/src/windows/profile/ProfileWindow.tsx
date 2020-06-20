import React from "react";

import {useUserProfile} from "../../contexts/auth-context";
import * as UI from "../../ui";
import {formatTime} from "../../services/date-formatter";
import {ProfileDeleteAccount} from "./ProfileDeleteAccount";
import {ProfileChangePassword} from "./ProfileChangePassword";
import {ProfileChangeEmail} from "./ProfileChangeEmail";

export const ProfileWindow = () => {
	const [profile] = useUserProfile();

	return (
		<UI.Column mx={["auto", "12"]} mb="48" mt={["72", "24"]} width={["view-l", "auto"]}>
			<UI.Card>
				<UI.Row bg="gray-1" mt="12" p="24">
					<UI.Header variant="large">Profile settings</UI.Header>
				</UI.Row>

				<ProfileChangeEmail />
				<ProfileChangePassword />
				<ProfileDeleteAccount />

				<UI.Row mainAxis="end" p="12" mt="12">
					<UI.Text variant="dimmed">Created at:</UI.Text>
					<UI.Text variant="monospaced" ml="6">
						{profile?.created_at && formatTime(profile.created_at)}
					</UI.Text>
				</UI.Row>
			</UI.Card>
		</UI.Column>
	);
};
