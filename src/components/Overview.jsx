import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";


class Overview extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				
				<div className="width-container wide xl grid gaps32">
					
					<Link className="button" to="/usersoverview">
						<div className="w100 margin-vertical-16">
							<FontAwesomeIcon icon={faUser} size="4x" />
						</div>
						<h3>{languageService.translate("Overview.User")}</h3>
					</Link>
					
					<Link className="button" to="/teamsoverview">
						<div className="w100 margin-vertical-16">
							<FontAwesomeIcon icon={faUsers} size="4x" />
						</div>
						<h3>{languageService.translate("Overview.Team")}</h3>
					</Link>
					
				</div>
				
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default Overview;