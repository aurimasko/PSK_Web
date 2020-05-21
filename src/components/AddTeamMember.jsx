import React from 'react';
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { languageService } from "../services/languageService.js";

class AddTeamMember extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			firstName: "",
			lastName: "",
			isAddButtonEnabled: true
		}

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
	}

	renderAddButton() {
		if (this.state.isAddButtonEnabled) {
			return (
				<input className="primary" type="submit" value={languageService.translate("Add")} />
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		return (
			<Layout ref={this.notifRef}>
				<div className="container wide">

					<h1 className="margin-bottom-8">{languageService.translate("AddTeamMember.Title")}</h1>

					<form className="flex-down" onSubmit={this.handleSubmit}>
						<label>
							{languageService.translate("AddTeamMember.EmailAddress")}
							<input required type="email" value={this.state.email} onChange={this.handleEmailChange} />
						</label>
						<label>
							{languageService.translate("AddTeamMember.FirstName")}
							<input required type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
						</label>
						<label>
							{languageService.translate("AddTeamMember.LastName")}
							<input required type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
						</label>
						<hr />

						{this.renderAddButton()}
					</form>
				</div>
			</Layout>
		);
	}

	handleEmailChange(event) {
		this.setState({ email: event.target.value });
	}

	handleFirstNameChange(event) {
		this.setState({ firstName: event.target.value });
	}

	handleLastNameChange(event) {
		this.setState({ lastName: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isAddButtonEnabled: false
		});

		userService.createUser(this.state.email, this.state.firstName, this.state.lastName)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("AddTeamMember.SuccessMessage"), isSuccess: true });

					//clear fields
					this.setState({
						email: "",
						firstName: "",
						lastName: ""
					});
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isAddButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default AddTeamMember;