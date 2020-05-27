import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUsers, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";


class WhoLearnedTopicTeams extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			teams: [
				{
					id: 1,
					leader: {firstName: "fname", lastName: "lname"},
					members: [
						1,
						2
					]
				},
				{
					id: 2,
					leader: {firstName: "fin", lastName: "lan"},
					members: [
						3
					]
				}
			]
		};
	}
	
	renderTeamMemberList(team) {
		return team.members.map(teamMate => this.renderTeamMember(teamMate));
	}
	
	renderTeamMember(teamMember) {
		return(
			<div className="flex-down margin-top-16">
				<h3>
					<Link to={"/"}>
						<FontAwesomeIcon className="margin-right-4" icon={faUser} />
						{teamMember.firstName} {teamMember.lastName}aa bb
					</Link>
				</h3>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.TimesLearned")}: </span>
					{teamMember.timesLearned}
				</div>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.LastTime")}: </span>
					{teamMember.lastLearningDay}
				</div>
			</div>
		);
	}
	
	renderTeamList() {
		return this.state.teams.map( (team, index) => this.renderTeam(team, index));
	}
	
	renderTeam(team, index) {
		return(
			<div className="flex-down margin-top-16">
				<h3>
					<button className="" onClick={() => this.handleClickTeam(index)}>
						<FontAwesomeIcon className="margin-right-4" icon={faUsers} />
						{team.leader.firstName} {team.leader.lastName}
					</button>
				</h3>
				
				{team.showFull ?
					this.renderTeamMemberList(team):
					""
				}
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
							{languageService.translate("WhoLearnedTopicTeams.Title", { topicName: this.props.match.params.topicId })}
						</h1>
					</div>
					
					{this.renderTeamList()}
					
				</div>
			</Layout>
		);
	}
	
	handleClickTeam(teamIndex) {
		let newTeams = this.state.teams;
		newTeams[teamIndex].showFull = !newTeams[teamIndex].showFull;
		
		this.setState({teams: newTeams});
	}
}

export default WhoLearnedTopicTeams;