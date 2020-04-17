import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faStar, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


class Team extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			managerId: "1",
			teamMembers: [
				{
					id: "1",
					firstName: "Antanas",
					lastName: "Antanaitis"
				},
				{
					id: "2",
					firstName: "Ona",
					lastName: "Onaitė"
				},
				{
					id: "3",
					firstName: "Elena",
					lastName: "Elenaitė"
				},
				{
					id: "4",
					firstName: "Petras",
					lastName: "Petraitis"
				}
			],
			
			listItems: null
		};
	}
	
	
	componentDidMount() {
		this.setState({
			listItems: this.state.teamMembers.map((member) => 
				<li key={member.id}>
					<Link to={"/user/" + member.id}>
						
						{member.id === this.state.managerId? 
							<FontAwesomeIcon icon={faStar} listItem />:
							<FontAwesomeIcon icon={faUser} listItem />
						}
						
						{member.firstName} {member.lastName}
					</Link>
				</li>
			)
			
		})
	}
	
	
	render() {
		return (
			<Layout>
			<div className="container wide">
				
				<div className="flex-right">
					
					<div className="flex-down margin-right-16 margin-left-8">
						<div className="flex-spacer"></div>
						<FontAwesomeIcon icon={faUsers} size="3x" />
						<div className="flex-spacer"></div>
					</div>
					
					<div>
						<h1>
							Komanda
						</h1>
						<h4>
							Vadovas: <Link to="/user/1">{this.state.teamMembers[0].firstName} {this.state.teamMembers[0].firstName}</Link>
						</h4>
					</div>
					
				</div>
				
				<h3 className="margin-top-24">Komandos nariai:</h3>
				
				<ul className="fa-ul">
					{this.state.listItems}
				</ul>
				
			</div>
			</Layout>
		);
	}
}

export default Team;