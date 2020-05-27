import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";
import { analysisService } from "../services/analysisService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';
import Loading from "./Loading";

class WhoLearnedTopicTeamMembers extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			teamMembers: null
		};
	}

	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.topicId !== this.props.match.params.topicId) {
			this.getData();
		}
	}

	async getData() {
		let result = await analysisService.fetchLearnedTopicUser(this.props.match.params.topicId);
		if (result.isSuccess === true) {
			this.setState({
				teamMembers: result.content.sort((a, b) => moment.utc(b.lastLearningDay.date) - moment.utc(a.lastLearningDay.date))
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
	
	render() {
		if (this.state.teamMembers === null) {
			return (
				<Layout>
					<Loading showText={true} />
				</Layout>
			);
		} else {
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
								{languageService.translate("WhoLearnedTopicTeamMembers.Title", { topicName: this.props.match.params.topicName })}
							</h1>
						</div>

						{this.renderTeammateList()}

					</div>
				</Layout>
			);
		}
	}
}

export default WhoLearnedTopicTeamMembers;