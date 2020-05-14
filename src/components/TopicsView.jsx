import React from 'react';
import Graph from 'vis-react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { topicService } from "../services/topicService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';

class TopicsView extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		this.state = {
			topicItems: null
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
			this.setState({
				topicItems: content.map((topic) =>
					<li key={topic.id}>
						<Link to={"/topic/" + topic.id}>
							{topic.name}
						</Link>
						<br />
					</li>
				)
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}
	
	render() {
		if (this.state.topicItems == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">
						<h3 className="margin-top-24">Topics:</h3>
						<ul className="fa-ul">
							{this.state.topicItems}
						</ul>
					</div>
				</Layout>
			);
		}
	}
	
	handleClick(event) {
		this.props.history.push("/topic/" + event.nodes);
	}
}


export default TopicsView;