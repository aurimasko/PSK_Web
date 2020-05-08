import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faTag } from '@fortawesome/free-solid-svg-icons'
import { roleService } from "../services/roleService.js";


class RolesList extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			listItems: null
		};
	}
	
	
	async componentDidMount() {
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
			console.log(JSON.stringify(result));
		}
	}
	
	
	render() {
		return (
			<Layout>
				<div className="container wide">
					
					<div className="flex-right">
						
						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							<FontAwesomeIcon icon={faTags} size="3x" />
							<div className="flex-spacer"></div>
						</div>
						
						
						<h1>
							Visos rolės
						</h1>
					</div>
					
					<h3 className="margin-top-24">Visų rolių sąrašas:</h3>
					
					<ul className="fa-ul">
						{this.state.listItems}
					</ul>
				</div>
			</Layout>
		);
	}
}

export default RolesList;