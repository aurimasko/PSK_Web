import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { userService } from "../services/userService.js";

class AddTeamMember extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			firstName: "",
			lastName: ""
		}

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		return (
			<Layout>
				<div className="container wide">

					<h1 className="margin-bottom-8">Sukurti vartotoją</h1>

					<form className="flex-down" onSubmit={this.handleSubmit}>
						<label>
							Elektroninio pašto adresas
							<input required type="email" value={this.state.email} onChange={this.handleEmailChange} />
						</label>
						<label>
							Vardas
							<input required type="text" value={this.state.firstName} onChange={this.handleFirstNameChange} />
						</label>
						<label>
							Pavardė
							<input required type="text" value={this.state.lastName} onChange={this.handleLastNameChange} />
						</label>
						<hr />

						<input className="primary" type="submit" value="Sukurti" />
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
		userService.createUser(this.state.email, this.state.firstName, this.state.lastName)
			.then((data) => {
				alert(JSON.stringify(data));
				if (data.isSuccess)
					alert("Success");
			});

		event.preventDefault();
	}
}

export default AddTeamMember;