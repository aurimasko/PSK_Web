import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


class User extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			id: "1",
			firstName: "Antanas",
			lastName: "Antanaitis",
			email: "demo@demo.org",
			role: {
				id: "1",
				name: "Junior developer"
			},
			managerId: "2",
		};
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
							{this.state.firstName} {this.state.lastName}
						</h1>
						<h4>
							Darbuotojo rolė: <Link className="" to={"/role/" + this.state.role.id}>{this.state.role.name}</Link>
						</h4>
					</div>
					
				</div>
				
				<div className="grid">
					<Link className="button" to="/calendar">Kalendorius</Link>
					<Link className="button" to="/topics">Temos</Link>
					<Link className="button" to={"/team/" + this.state.managerId}>Komanda kuriai priklauso</Link>
					<Link className="button" to={"/team/" + this.state.id}>Komanda kuriai vadovauja</Link>
				</div>
				
			</div>
			</Layout>
		);
	}
}

export default User;