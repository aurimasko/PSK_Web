import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../services/auth.js";
import { roleService } from "../services/roleService.js";
import moment from 'moment';

class User extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			role: null
		};
	}

	async componentDidMount() {
		if (auth.user.roleId) {
			var result = await roleService.fetchRole(auth.user.roleId);
			if (result.isSuccess === true) {
				this.setState({
					role: result.content[0]
				});
			} else {
				console.log(JSON.stringify(result));
            }
		}
    }

	renderRole() {
		if (this.state.role) {
			return (
				<h4>
					Darbuotojo rolė: <Link className="" to={"/role/" + this.state.role.id}>{this.state.role.name}</Link>
				</h4>);
		} else {
			return "";
        }
    }

	render() {
		return (
			<Layout>
				<div className="container wide">				
					<div className="flex-right">
					
						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							<FontAwesomeIcon icon={faUser} size="3x" />
							<div className="flex-spacer"></div>
						</div>
					
						<div>
							<h1>
								{auth.user.firstName} {auth.user.lastName}
							</h1>
							{this.renderRole()}
							<h4>
								El.Pašto adresas: {auth.user.username}
							</h4>
							<h4>
								Registracijos data: {moment(auth.user.creationDate).format('YYYY-MM-DD hh:mm:ss')}
							</h4>
							<button>Redaguoti</button>
							<button>Keisti slaptažodį</button>
						</div>
					
					</div>
				
				</div>
			</Layout>
		);
	}
}

export default User;