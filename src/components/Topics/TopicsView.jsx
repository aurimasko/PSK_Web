import React from 'react';
import Layout from "../Layout";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { topicService } from "../../services/topicService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faPlus } from '@fortawesome/free-solid-svg-icons'
import { topicFormatHelpers } from "../../helpers/topicFormatHelpers.js";
import NestedTopicList from "./NestedTopicList";

class TopicsView extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		this.state = {
			originalTopicData: null,
			formattedTopicData: null,
			unassignedTopicData: null
		};

		this.notifRef = React.createRef();	
		this.handleClick = this.handleClick.bind(this);
	}

	async componentDidMount() {
		this.getData();
	}

	async getData() {
		let result = await topicService.fetchTopics();
		if (result.isSuccess === true) {
			let content = result.content;
			const nestedTopicObj = topicFormatHelpers.topicListNester(content);
			
			this.setState({
				originalTopicData: content,
				formattedTopicData: nestedTopicObj.formattedTopicData,
				unassignedTopicData: nestedTopicObj.unassignedTopicData
			});
		}
		else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}
	
	
	
	render() {
		if (this.state.originalTopicData === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">
						<h1 className="margin-bottom-16">
							{languageService.translate("Topics.Title")}:
						</h1>

						<Link className="button primary margin-top-16 margin-bottom-16" to={"/topic/add"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPlus} />
							{languageService.translate("Add")}
						</Link>
						
						<NestedTopicList topics={this.state.originalTopicData} />
						
					</div>
				</Layout>
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
	
	renderFailedTopics() {
		if (this.state.unassignedTopicData.length > 0) {
			
			const theList = this.state.unassignedTopicData.map((topic) =>
				<li key={topic.id}>
					<Link to={"/topic/" + topic.id}>
						<FontAwesomeIcon icon={faLightbulb} listItem />
						{topic.name}
					</Link>
				</li>
			);
			
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


export default TopicsView;