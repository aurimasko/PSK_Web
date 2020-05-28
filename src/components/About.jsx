import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
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
							<FontAwesomeIcon icon={faInfoCircle} size="3x" />
							<div className="flex-spacer"></div>
						</div>
						
						<h1>
							{languageService.translate("About.Title")}
						</h1>
					</div>
					
					<div className="margin-16">
						<h2 className="margin-top-16">
							{languageService.translate("About.TeamDescriptionTitle")}
						</h2>
						<p className="margin-top-16">
							{languageService.translate("About.TeamDescriptionContent1")}
						</p>
						<p className="margin-top-16">
							{languageService.translate("About.TeamDescriptionContent2")}
						</p>
					</div>
					
					<div className="margin-16">
						<h2 className="margin-top-16">
							{languageService.translate("About.SystemDescriptionTitle")}
						</h2>
						<p className="margin-top-8">
							{languageService.translate("About.SystemDescriptionContent1")}
						</p>
						<p className="margin-top-8">
							{languageService.translate("About.SystemDescriptionContent2")}
						</p>
					</div>
					
					<div className="margin-16">
						<h2 className="margin-top-16">
							{languageService.translate("About.LegalTitle")}
						</h2>
						<p className="margin-top-8">
							TODO: add licenses or delete this part of the page
						</p>
					</div>
				</div>
			</Layout>
		);
	}
}

export default About;