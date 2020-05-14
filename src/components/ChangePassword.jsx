import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import Loading from "../components/Loading";

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
					Change
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

					<h1 className="margin-bottom-8">Change password</h1>

					<form className="flex-down" onSubmit={this.handleSubmit}>

						<label>
							Current password
						<input required type="password" value={this.state.currentPassword} onChange={this.handleCurrentPasswordChange} />
						</label>
						<label>
							New password
						<input required type="password" value={this.state.newPassword} onChange={this.handleNewPasswordChange} />
						</label>
						<label>
							New password repeated
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
					this.notifRef.current.addNotification({ text: "Password changed. You will be logged out.", isSuccess: true });
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