import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import Loading from "../components/Loading";
import { languageService } from "../services/languageService.js";

class ChangePassword extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentPassword: null,
			newPassword: null,
			newPasswordRepeated: null,
			isUpdateButtonEnabled: true
		}

		this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
		this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
		this.handleNewPasswordRepeatedChange = this.handleNewPasswordRepeatedChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
	}

	renderUpdateButton() {
		if (this.state.isUpdateButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isUpdateButtonEnabled}>
					{languageService.translate("Change")}
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		return (
			<Layout ref={this.notifRef}>
				<div className="container wide">

					<h1 className="margin-bottom-8">{languageService.translate("ChangePassword.Title")}</h1>

					<form className="flex-down" onSubmit={this.handleSubmit}>

						<label>
							{languageService.translate("ChangePassword.CurrentPassword")}
						<input required type="password" value={this.state.currentPassword} onChange={this.handleCurrentPasswordChange} />
						</label>
						<label>
							{languageService.translate("ChangePassword.NewPassword")}
						<input required type="password" value={this.state.newPassword} onChange={this.handleNewPasswordChange} />
						</label>
						<label>
							{languageService.translate("ChangePassword.RepeatNewPassword")}
						<input required type="password" value={this.state.newPasswordRepeated} onChange={this.handleNewPasswordRepeatedChange} />
						</label>
						<hr />

						{this.renderUpdateButton()}
					</form>
				</div>
			</Layout>
		);
	}

	handleCurrentPasswordChange(event) {
		this.setState({ currentPassword: event.target.value });
	}

	handleNewPasswordChange(event) {
		this.setState({ newPassword: event.target.value });
	}

	handleNewPasswordRepeatedChange(event) {
		this.setState({ newPasswordRepeated: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isUpdateButtonEnabled: false
		});

		userService.changePassword(this.state.currentPassword, this.state.newPassword, this.state.newPasswordRepeated)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("ChangePassword.SuccessMessage"), isSuccess: true });
					let thisUp = this;
					//Give some time to read message
					setTimeout(function () {
						auth.logout();
						thisUp.props.history.push("/login");
					}, 2000);
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isUpdateButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default ChangePassword;