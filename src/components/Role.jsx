import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { roleService } from "../services/roleService.js";
import { userService } from "../services/userService.js";
import moment from 'moment';
import Loading from "../components/Loading";

class Role extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			role: null,
			usersList: null,
			creator: null
		};
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
		var roleResult = await roleService.fetchRole(id);
		if (roleResult.isSuccess === true) {
			this.setState({
				role: roleResult.content[0]
			});
		} else {
			console.log(JSON.stringify(roleResult));
		}

		var usersResult = await userService.fetchUsersByRole(id);
		if (usersResult.isSuccess === true) {
			var users = usersResult.content;
			this.setState({
				usersList: users.map((user) =>
					<li key={user.id}>
						<Link to={"/user/" + user.id}>
							<FontAwesomeIcon icon={faTag} listItem />
							{user.firstName} {user.lastName}
						</Link>
					</li>
				)
			});
		} else {
			console.log(JSON.stringify(usersResult));
		}
	}

	renderRoleUsers() {
		if (this.state.usersList) {
			if (this.state.usersList.length > 0) {
				return (
					<div>
						<h3 className="margin-top-24">Visų vartotojų sąrašas:</h3>

						<ul className="fa-ul">
							{this.state.usersList}
						</ul>
					</div>
				);
			} else {
				return "";
			}
		} else {
			return <Loading width={50} height={50} type={"balls"}/>;
		}
	}
	
	
	render() {
		if (this.state.role == null) {
			return (
				<Layout>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout>
					<div className="container wide">

						<div className="flex-right">

							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<FontAwesomeIcon icon={faTag} size="3x" />
								<div className="flex-spacer"></div>
							</div>

							<div>
								<h1>
									{this.state.role.name} role
								</h1>
								<h5>
									Creation date: {moment.utc(this.state.role.creationDate).format('YYYY-MM-DD hh:mm')}
								</h5>
								{this.renderRoleUsers()}
							</div>


						</div>

					</div>
				</Layout>
			);
		}
	}
}

export default Role;