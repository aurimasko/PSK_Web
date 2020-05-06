import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { roleService } from "../services/roleService.js";

class Role extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = { };
	}

	async componentDidMount() {
		
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
					
				</div>
			</Layout>
		);
	}
}

export default Role;