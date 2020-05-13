import React from 'react';
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import { roleService } from "../services/roleService.js";
import Loading from "../components/Loading";

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
		var id = this.props.match.params.id;
		var result = await userService.fetchUserById(id);
		if (result.isSuccess === true) {
			this.setState({
				user: result.content[0]
			});

			this.getRole(result.content[0].roleId);
		} else {
			console.log(JSON.stringify(result));
		}

		var rolesResult = await roleService.fetchRoles();
		if (rolesResult.isSuccess === true) {
			this.setState({
				roles: rolesResult.content
			});
		} else {
			console.log(JSON.stringify(rolesResult));
		}
	}

	async getRole(roleId) {
		if (roleId) {
			var result = await roleService.fetchRole(roleId);
			if (result.isSuccess === true) {
				this.setState({
					userRole: result.content[0],
					newRoleId: result.content[0].id
				});
			} else {
				console.log(JSON.stringify(result));
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
				<Layout>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout>
					<div className="container wide">

						<h1 className="margin-bottom-8">Change {this.state.user.firstName} {this.state.user.lastName} role</h1>

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

		var newRoleId = this.state.newRoleId;
		var userToUpdate = this.state.user;

		if (newRoleId === "")
			newRoleId = null;

		userToUpdate.roleId = newRoleId;

		//TODO: If current user, change auth.user property
		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					this.props.history.push("/user/" + this.state.user.id);
				} else {
					console.log(JSON.stringify(data));
				}

				this.setState({
					isChangeButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default ChangeRole;