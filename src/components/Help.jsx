import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";

class About extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="container wide">
					
					<div className="flex-right">
					
						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							<FontAwesomeIcon icon={faQuestionCircle} size="3x" />
							<div className="flex-spacer"></div>
						</div>
						
						<h1>
							{languageService.translate("Help.Title")}
						</h1>
					</div>
					
					<p className="margin-16 margin-bottom-8">
						{languageService.translate("Help.HelpText")} <a className="" href="confiktura@gmail.com">confiktura@gmail.com</a>
					</p>
					
					
				</div>
			</Layout>
		);
	}
}

export default About;