import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";


class WhoLearnedTopicTeamMembers extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			teamMembers: [{}, {}, {}, {}]
		};
	}
	
	renderTeammateList() {
		return this.state.teamMembers.map(teamMate => this.renderTeammate(teamMate));
	}
	
	renderTeammate() {
		return(
			<div className="flex-down margin-top-16">
				<h3>
					<Link to={"/"}>
						<FontAwesomeIcon className="margin-right-4" icon={faUser} />
						Vardas Pavardė
					</Link>
				</h3>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.TimesLearned")}: </span>
					5
				</div>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.LastTime")}: </span>
					2020-20-20
				</div>
			</div>
		);
	}
	
	render() {
		return (
			<Layout>
				<div className="container wide">
					
					<div className="flex-right">
						
						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							<Link className="button back-button" to={"/"}>
								<FontAwesomeIcon icon={faArrowLeft} />
							</Link>
							<div className="flex-spacer"></div>
						</div>
						
						<h1>
							{languageService.translate("WhoLearnedTopicTeamMembers.Title", { topicName: this.props.match.params.topicId })}
						</h1>
					</div>
					
					{this.renderTeammateList()}
					
				</div>
			</Layout>
		);
	}
}

export default WhoLearnedTopicTeamMembers;