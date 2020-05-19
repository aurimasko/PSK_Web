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


class ChangeRole extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			newRoleId: null,
			isChangeButtonEnabled: true,
			roles: null,
			userRole: null
		}

		this.handleRoleChange = this.handleRoleChange.bind(this);
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
		let result = await userService.fetchUserById(id);
		if (result.isSuccess === true) {
			this.setState({
				user: result.content[0]
			});

			this.getRole(result.content[0].roleId);
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			return;
		}

		let rolesResult = await roleService.fetchRoles();
		if (rolesResult.isSuccess === true) {
			this.setState({
				roles: rolesResult.content
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(rolesResult) });
			return;

		}
	}

	async getRole(roleId) {
		if (roleId) {
			let result = await roleService.fetchRole(roleId);
			if (result.isSuccess === true) {
				this.setState({
					userRole: result.content[0],
					newRoleId: result.content[0].id
				});
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		} else {
			this.setState({
				userRole: {}
			});
		}
	}

	renderChangeButton() {
		if (this.state.isChangeButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isChangeButtonEnabled}>
					Change
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.user == null || this.state.userRole == null || this.state.roles == null) {
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
								Change {this.state.user.firstName} {this.state.user.lastName} role
							</h1>
						</div>
						
						<form className="flex-down" onSubmit={this.handleSubmit}>

							<label>
								Pick a role:
								<select value={this.state.newRoleId} onChange={this.handleRoleChange}>
									<option key="" value="">None</option>
									{
										this.state.roles.map((role) => {
											return (
												<option key={role.id} value={role.id}>{role.name}</option>
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

	handleRoleChange(event) {
		this.setState({ newRoleId: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isChangeButtonEnabled: false
		});

		let newRoleId = this.state.newRoleId;
		let userToUpdate = this.state.user;

		if (newRoleId === "")
			newRoleId = null;

		userToUpdate.roleId = newRoleId;

		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: "Role changed successfully.", isSuccess: true });

					//If current user, change auth.user property
					//Will only happen to admin, since he can only change his own role
					if (this.state.user === auth.user.id) {
						auth.user.roleId = newRoleId;
					}

					let thisUp = this;

					//TODO: fix role being cached in User profile
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

export default ChangeRole;