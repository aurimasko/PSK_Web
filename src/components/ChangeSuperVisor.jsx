import React from 'react';
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import { roleService } from "../services/roleService.js";
import { auth } from "../services/auth.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../services/languageService.js";

class ChangeSuperVisor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			newSuperVisorId: null,
			isChangeButtonEnabled: true,
			superVisors: null
		}

		this.handleSuperVisorChange = this.handleSuperVisorChange.bind(this);
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
		let id = this.props.match.params.id;
		//Get all users available (down the heirarchy)
		let result = await userService.fetchUsers();
		if (result.isSuccess === true) {

			//Exclude the user being updated
			let currentUsers = result.content.filter((u) => u.id === id);
			let filteredUsers = result.content.filter((u) => u.id !== id);
			let currentUser = currentUsers[0];

			this.setState({
				superVisors: filteredUsers,
				user: currentUser,
				newSuperVisorId: currentUser.superVisorId
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderChangeButton() {
		if (this.state.isChangeButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isChangeButtonEnabled}>
					{languageService.translate("Change")}
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.user == null || this.state.superVisors == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">

						<div className="flex-right">

							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<Link className="button back-button" to={"/user/" + this.props.match.params.id}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>
								{languageService.translate("ChangeSuperVisor.Title", { name: this.state.user.firstName + " " + this.state.user.lastName })}
							</h1>
						</div>

						<form className="flex-down" onSubmit={this.handleSubmit}>

							<label>
								{languageService.translate("ChangeSuperVisor.PickSuperVisor")}:
								<select value={this.state.newSuperVisorId} onChange={this.handleSuperVisorChange}>
									{
										this.state.superVisors.map((superVisor) => {
											return (
												<option key={superVisor.id} value={superVisor.id}>{superVisor.firstName} {superVisor.lastName}</option>
											);
										})
									}
								</select>
							</label>
							<hr />
							{this.renderChangeButton()}
						</form>
					</div>
				</Layout>
			);
		}
	}

	handleSuperVisorChange(event) {
		this.setState({ newSuperVisorId: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isChangeButtonEnabled: false
		});

		let userToUpdate = this.state.user;

		//skip sending request if not changed
		if (this.state.newSuperVisorId === userToUpdate.superVisorId) {
			this.notifRef.current.addNotification({ text: languageService.translate("ChangeSuperVisor.SuccessMessage"), isSuccess: true });
			return;
		}

		userToUpdate.superVisorId = this.state.newSuperVisorId;

		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("ChangeSuperVisor.SuccessMessage"), isSuccess: true });

					let thisUp = this;
					//Give some time to read message
					setTimeout(function () {
						thisUp.props.history.push("/user/" + thisUp.state.user.id);
					}, 1000);
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isChangeButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default ChangeSuperVisor;