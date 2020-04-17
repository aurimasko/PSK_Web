import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


class Role extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			name: "Junior developer",
			
			users: [
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
			listItems: this.state.users.map((user) => 
				<li key={user.id}>
					<Link to={"/user/" + user.id}>
						<FontAwesomeIcon icon={faUserTag} listItem />
						{user.firstName} {user.lastName}
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
							<FontAwesomeIcon icon={faTag} size="3x" />
							<div className="flex-spacer"></div>
						</div>
						
						<div>
							<h1>
								{this.state.name}
							</h1>
							<h4>
								rolė
							</h4>
						</div>
						
					</div>
					
					
					{this.state.listItems? 
						<>
							<h3 className="margin-top-24">Sąrašas darbuotojų, kurių rolė yra {this.state.name}:</h3>
							
							<ul className="fa-ul">
								{this.state.listItems}
							</ul>
						</> :
						"darbuotojų nėra"
					}
					
					
				</div>
			</Layout>
		);
	}
}

export default Role;