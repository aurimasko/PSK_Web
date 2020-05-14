import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";

class EditUser extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			newEmail: null,
			newFirstName: null,
			newLastName: null,
			isUpdateButtonEnabled: true
		}

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
		this.handleLastNameChange = this.handleLastNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
	}

	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getData();
		}
	}

	async getData() {
		//let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		//TODO: check if user to edit == current user, else permission denied.
		//TODO: admin can edit anyone

		//var result = await userService.fetchUserById(id);
		//if (result.isSuccess == true) {
		//	var user = result.
		//} else {
		//	console.log(JSON.stringify(result));
  //      }

		this.setState({
			user: auth.user,
			newEmail: auth.user.username,
			newFirstName: auth.user.firstName,
			newLastName: auth.user.lastName
		});
	}

	renderUpdateButton() {
		if (this.state.isUpdateButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isUpdateButtonEnabled}>
					Update
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.user == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			//add message so that if email address is changed, the username will change
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">

						<h1 className="margin-bottom-8">Edit {this.state.user.firstName} {this.state.user.lastName}</h1>

						<form className="flex-down" onSubmit={this.handleSubmit}>
							
							<label>
								Email address
							<input required type="email" value={this.state.newEmail} onChange={this.handleEmailChange} />
							</label>
							<label>
								First name
							<input required type="text" value={this.state.newFirstName} onChange={this.handleFirstNameChange} />
							</label>
							<label>
								Last name
							<input required type="text" value={this.state.newLastName} onChange={this.handleLastNameChange} />
							</label>
							<hr />

							{this.renderUpdateButton()}
						</form>
					</div>
				</Layout>
			);
		}
	}

	handleEmailChange(event) {
		this.setState({ newEmail: event.target.value });
	}

	handleFirstNameChange(event) {
		this.setState({ newFirstName: event.target.value });
	}

	handleLastNameChange(event) {
		this.setState({ newLastName: event.target.value });
	}

	handleSubmit(event) {
		let userToUpdate = this.state.user;
		userToUpdate.firstName = this.state.newFirstName;
		userToUpdate.lastName = this.state.newLastName;
		userToUpdate.username = this.state.newEmail;

		this.setState({
			isUpdateButtonEnabled: false
		});

		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					let userReturned = data.content;
					//update current user (check if current user, admin can edit anyone)
					if (auth.user.id === userReturned.id) {
						auth.user = userReturned;
					}

					this.setState({
						user: userReturned
					});

					this.props.history.push("/user/" + userReturned.id + "/edit");
					//Add proper handling of concurrency exception
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

export default EditUser;