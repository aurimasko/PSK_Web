import React from 'react';
import Layout from "../Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../../services/languageService.js";
import NestedTopicList from "./NestedTopicList";
import Loading from "../../components/Loading";


class TeamLearningPlan extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			learnedTopics: null,
			learnedTopicsIds: ["id1", "id2"],
			plannedTopics: [{id: 0, name: "hhh"}, {id: 1, name: "aaaa aaa"}]
		};
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
		if (this.state.learnedTopics === null || this.state.plannedTopics === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		}
		else {
			return (
				<Layout>
					
					<div className="width-container wide xl grid-xl gaps32">
						
						<div className="container wide">
							<h1 className="">
								{languageService.translate("TeamLearningPlan.Learned")}
							</h1>
							
							<NestedTopicList topics={this.state.learnedTopics} showLearned={true} learnedTopicIds={this.state.learnedTopicIds} />
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