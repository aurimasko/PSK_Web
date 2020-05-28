import React from 'react';
import Layout from "../Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../../services/languageService.js";
import NestedTopicList from "./NestedTopicList";
import Loading from "../../components/Loading";
import { analysisService } from "../../services/analysisService.js";
import { topicService } from "../../services/topicService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { auth } from "../../services/auth.js";

class TeamLearningPlan extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			topics: null,
			learnedTopicsIds: null,
			plannedTopics: null
		};

		this.notifRef = React.createRef();
	}

	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getData();
		}
	}

	async getData() {
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		let result = await topicService.fetchTopics();
		if (result.isSuccess === true) {
			this.setState({
				topics: result.content
			});

			this.getTopicsTeam();
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	async getTopicsTeam() {
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		let result = await analysisService.fetchTopicsTeam(id);
		if (result.isSuccess === true) {
			this.setState({
				learnedTopicsIds: result.content.planningToLearnTopics.map((s) => s.topic.id),
				plannedTopics: result.content.planningToLearnTopics.map((s) => s.topic)
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderPlannedTopics() {
		return (
			<ul className="fa-ul">
				{this.state.plannedTopics.map((topic) => this.renderPlannedTopic(topic))}
			</ul>
		);
	}
	
	renderPlannedTopic(topic) {
		return (
			<li key={topic.id}>
				<Link to={"/topic/" + topic.id}>
					<FontAwesomeIcon className="" icon={faLightbulb} listItem />
					{topic.name}
				</Link>
			</li>
		);
	}
	
	render() {
		if (this.state.topics === null || this.state.plannedTopics === null || this.state.plannedTopicsIds === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		}
		else {
			return (
				<Layout ref={this.notifRef}>
					
					<div className="width-container wide xl grid-xl gaps32">
						
						<div className="container wide">
							<h1 className="">
								{languageService.translate("TeamLearningPlan.Learned")}
							</h1>
							
							<NestedTopicList topics={this.state.topics} showLearned={true} learnedTopicIds={this.state.learnedTopicsIds} />
						</div>
						
						<div className="container wide">
							<h1 className="">
								{languageService.translate("TeamLearningPlan.Planned")}
							</h1>
							
							{this.renderPlannedTopics()}
						</div>
						
					</div>
				</Layout>
			);
		}
	}
}

export default TeamLearningPlan;