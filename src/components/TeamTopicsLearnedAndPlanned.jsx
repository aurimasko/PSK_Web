import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";


class TeamTopicsLearnedAndPlanned extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				<div className="container">
					<h1 className="extra center">
						<FontAwesomeIcon icon={faSearch} />
					</h1>
					<h1 className="center">WIP</h1>
					
					<Link className="button primary margin-top-32" to="/">{languageService.translate("NotFound.Link")}</Link>
				</div>
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default TeamTopicsLearnedAndPlanned;