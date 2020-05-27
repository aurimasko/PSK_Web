import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";
import { analysisService } from "../services/analysisService.js";
import { topicService } from "../services/topicService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';
import Loading from "./Loading";

class WhoLearnedTopicTeamMembers extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			teamMembers: null,
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

	renderTeammateList() {
		return this.state.teamMembers.map(teamMate => this.renderTeammate(teamMate));
	}
	
	renderTeammate(teamMate) {
		return(
			<div className="flex-down margin-top-16">
				<h3>
					<Link to={"/user/" + teamMate.employee.id}>
						<FontAwesomeIcon className="margin-right-4" icon={faUser} />
						{teamMate.employee.firstName} {teamMate.employee.lastName}
					</Link>
				</h3>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.TimesLearned")}: </span>
					{teamMate.totalDays}
				</div>
				<div>
					<span className="bold">{languageService.translate("WhoLearnedTopicTeamMembers.LastTime")}: </span>
					{moment.utc(teamMate.lastLearningDay.date).local().format('YYYY-MM-DD')}
				</div>
			</div>
		);
	}

	renderAnalysis() {
		if (this.state.selectedTopic === null) {
			return <h4>{languageService.translate("WhoLearnedTopicTeamMembers.SelectTopic")}</h4>
		} else {
			if (this.state.teamMembers === null) {
				return <Loading showText={true} />;
			} else {
				if (this.state.teamMembers.length === 0) {
					return <h4>{languageService.translate("WhoLearnedTopicTeamMembers.NoUsersToShow")}</h4>
				} else {
					return (
						<>
							<div className="flex-right">
								<h1>
									{languageService.translate("WhoLearnedTopicTeamMembers.Title", { topicName: this.state.selectedTopic.name })}
								</h1>
							</div>
							{this.renderTeammateList()}
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
								<Link className="button back-button" to={"/user/" + this.props.match.params.id}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>
								{languageService.translate("WhoLearnedTopicTeamMembers.TitleTopic")}
							</h1>
						</div>
						<label>
							<h4>{languageService.translate("WhoLearnedTopicTeamMembers.Topic")}:</h4>
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
			teamMembers: null
		});

		analysisService.fetchLearnedTopicUser(selectedTopicId)
			.then((result) => {
				if (result.isSuccess === true) {
					this.setState({
						teamMembers: result.content.sort((a, b) => moment.utc(b.lastLearningDay.date) - moment.utc(a.lastLearningDay.date))
					});

				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
				}
			});

	}
}

export default WhoLearnedTopicTeamMembers;