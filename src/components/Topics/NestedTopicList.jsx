import React from 'react';
import Layout from "../Layout";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { topicService } from "../../services/topicService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faPlus, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { topicFormatHelpers } from "../../helpers/topicFormatHelpers.js";


class NestedTopicList extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		this.state = {
			formattedTopicData: null,
			unassignedTopicData: null
		};

		this.notifRef = React.createRef();	
		this.handleClick = this.handleClick.bind(this);
	}

	async componentDidMount() {
		const nestedTopicObj = topicFormatHelpers.topicListNester(this.props.topics);
		
		this.setState({
			originalTopicData: this.props.topics,
			formattedTopicData: nestedTopicObj.formattedTopicData,
			unassignedTopicData: nestedTopicObj.unassignedTopicData
		});
	}
	
	render() {
		if (this.state.formattedTopicData === null) {
			return (
				<Loading showText={true} />
			);
		}else {
			return (
				<>
					{this.renderNestedTopics(this.state.formattedTopicData)}
					{this.renderFailedTopics()}
				</>
			);
		}
	}
	
	renderNestedTopics(topicList) {
		return (
			<ul className="fa-ul">
				{topicList.map(topic => this.renderOneNestedTopic(topic))}
			</ul>
		);
	}
	
	renderOneNestedTopic(topic) {
		let nestedList = <></>;
		
		if (topic.children.length > 0) {
			nestedList = (this.renderNestedTopics(topic.children));
		}
		
		if (!this.props.showLearned) {
			return (
				<li key={topic.id}>
					<Link to={"/topic/" + topic.id}>
						<FontAwesomeIcon className="" icon={faLightbulb} listItem />
						{topic.name}
					</Link>
					
					{nestedList}
				</li>
			);
		}
		else {
			let isLearned = this.props.learnedTopicIds.includes(topic.id);
			
			return (
				<li key={topic.id}>
					<Link to={"/topic/" + topic.id}>
						{isLearned ?
							<FontAwesomeIcon className="" icon={faCheckSquare} listItem /> :
							<FontAwesomeIcon className="" icon={faSquare} listItem />
						}
						{topic.name}
					</Link>
					
					{nestedList}
				</li>
			);
		}
	}
	
	renderFailedTopics() {
		if (this.state.unassignedTopicData.length > 0) {
			
			let theList;
			
			if (!this.props.showLearned) {
				theList = this.state.unassignedTopicData.map((topic) =>
					<li key={topic.id}>
						<Link to={"/topic/" + topic.id}>
							<FontAwesomeIcon icon={faLightbulb} listItem />
							{topic.name}
						</Link>
					</li>
				);
			}
			else {
				theList = this.state.unassignedTopicData.map((topic) =>
					<li key={topic.id}>
						<Link to={"/topic/" + topic.id}>
						{this.props.learnedTopicIds.includes(topic.id) ?
							<FontAwesomeIcon className="" icon={faCheckSquare} listItem /> :
							<FontAwesomeIcon className="" icon={faSquare} listItem />
						}
						{topic.name}
							{topic.name}
						</Link>
					</li>
				);
			}
			
			
			
			return (
				<>
					<h3 className="margin-top-24 margin-bottom-8">{languageService.translate("Topics.FailedTopics")}:</h3>
					
					<ul className="fa-ul">
						{theList}
					</ul>
				</>
			);
		}
	}
	
	handleClick(event) {
		this.props.history.push("/topic/" + event.nodes);
	}
}


export default NestedTopicList;