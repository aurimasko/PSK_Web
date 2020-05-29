import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUsers, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";
import { analysisService } from "../services/analysisService.js";
import { topicService } from "../services/topicService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';
import Loading from "./Loading";

class WhoLearnedTopicTeams extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			teams: null,
			topics: null,
			selectedTopic: null,
			selectedTopicId: null
		};

		this.handleTopicChange = this.handleTopicChange.bind(this);

		this.notifRef = React.createRef();
	}

	async componentDidMount() {
		this.getData();
	}

	async getData() {
		let result = await topicService.fetchTopics();
		if (result.isSuccess === true) {
			this.setState({
				topics: result.content
			});

		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderTeamMemberList(team) {
		return team.members.map(teamMate => this.renderTeamMember(teamMate));
	}
	
	renderTeamMember(teamMember) {
		return(
			<div className="flex-down margin-top-16">
				<h3>
					<Link to={"/user/" + teamMember.employee.id}>
						<FontAwesomeIcon className="margin-right-4" icon={faUser} />
						{teamMember.employee.firstName} {teamMember.employee.lastName}
					</Link>
				</h3>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.TimesLearned")}: </span>
					{teamMember.totalDays}
				</div>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.LastTime")}: </span>
					{moment.utc(teamMember.lastLearningDay.date).local().format('YYYY-MM-DD')}
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
						{team.superVisor.firstName} {team.superVisor.lastName}
					</button>
				</h3>
				
				{team.showFull ?
					this.renderTeamMemberList(team):
					""
				}
			</div>
		);
	}

	renderAnalysis() {
		if (this.state.selectedTopic === null) {
			return <h4>{languageService.translate("WhoLearnedTopicTeamMembers.SelectTopic")}</h4>
		} else {
			if (this.state.teams === null) {
				return <Loading showText={true} />;
			} else {
				if (this.state.teams.length === 0) {
					return <h4>{languageService.translate("WhoLearnedTopicTeamMembers.NoUsersToShow")}</h4>
				} else {
					return (
						<>
							<div className="flex-right">
								<h1>
									{languageService.translate("WhoLearnedTopicTeams.Title", { topicName: this.state.selectedTopic.name })}
								</h1>
							</div>
							{this.renderTeamList()}
						</>
					);
				}
			}
		}
	}

	render() {
		if (this.state.topics === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">
						<div className="flex-right">

							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<Link className="button back-button" to={"/overview"}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>
								{languageService.translate("WhoLearnedTopicTeams.TitleTopic")}
							</h1>
						</div>
						<label>
							<h4>{languageService.translate("WhoLearnedTopicTeams.Topic")}:</h4>
							<select value={this.state.selectedTopicId} onChange={this.handleTopicChange}>
								<option key="" value="">{languageService.translate("None")}</option>
								{
									this.state.topics.map((topic) => {
										return (
											<option key={topic.id} value={topic.id}>{topic.name}</option>
										);
									})
								}
							</select>
						</label>
					</div>
					<div className="container wide">
						{this.renderAnalysis()}
					</div>
				</Layout>
			);
		}
	}

	handleTopicChange(event) {
		let selectedTopicId = event.target.value;

		if (selectedTopicId === "") {
			this.setState({
				selectedTopicId: selectedTopicId,
				selectedTopic: null
			});
			return;
		}

		this.setState({
			selectedTopicId: selectedTopicId,
			selectedTopic: this.state.topics.filter((t) => t.id === selectedTopicId)[0],
			teams: null
		});

		analysisService.fetchLearnedTopicTeam(selectedTopicId)
			.then((result) => {
				if (result.isSuccess === true) {
					this.setState({
						teams: result.content
					});

				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
				}
			});

	}
	
	handleClickTeam(teamIndex) {
		let newTeams = this.state.teams;
		newTeams[teamIndex].showFull = !newTeams[teamIndex].showFull;
		
		this.setState({teams: newTeams});
	}
}

export default WhoLearnedTopicTeams;