import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faTag } from '@fortawesome/free-solid-svg-icons'
import { roleService } from "../services/roleService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";

class RolesList extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			listItems: null
		};

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
		var result = await roleService.fetchRoles();
		if (result.isSuccess === true) {
			var roles = result.content;
			this.setState({
				listItems: roles.map((role) =>
					<li key={role.id}>
						<Link to={"/role/" + role.id}>
							<FontAwesomeIcon icon={faTag} listItem />
							{role.name}
						</Link>
					</li>
				)

			})
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}
	
	
	render() {
		if (this.state.listItems === null) {
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
								<FontAwesomeIcon icon={faTags} size="3x" />
								<div className="flex-spacer"></div>
							</div>


							<h1>
								Roles
							</h1>
						</div>

						<h3 className="margin-top-24">Users in role:</h3>

						<ul className="fa-ul">
							{this.state.listItems}
						</ul>
					</div>
				</Layout>
			);
		}
	}
}

export default RolesList;