import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import Loading from "../components/Loading";
import { Redirect } from "react-router-dom";

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
			<Layout>
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
					auth.logout();
					this.props.history.push("/login");
				} else {
					alert(JSON.stringify(data));
					console.log(JSON.stringify(data));
				}

				this.setState({
					isUpdateButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default ChangePassword;