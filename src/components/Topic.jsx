import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { topicService } from "../services/topicService.js";
import { topicChangesService } from "../services/topicChangesService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';

class Topic extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			topic: null,
			parentTopic: null,
			topicChanges: null
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
		let id = this.props.match.params.id;
		let result = await topicService.fetchTopic(id);
		if (result.isSuccess === true) {
			this.setState({
				topic: result.content[0]
			});
			this.getParentTopic(result.content[0].parentId);
			this.getTopicChanges();
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	async getTopicChanges() {
		let result = await topicChangesService.fetchTopicChangesForTopic(this.state.topic.id);
		if (result.isSuccess === true) {
			let topicChanges = result.content;
			//sort by date
			let sortedTopicChanges = topicChanges.sort((a, b) => b.creationDate - a.creationDate);
			this.setState({
				topicChanges: sortedTopicChanges
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	async getParentTopic(id) {
		if (id) {
			let result = await topicService.fetchTopic(id);
			if (result.isSuccess === true) {
				this.setState({
					parentTopic: result.content[0]
				});
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		} else {
			this.setState({
				parentTopic: {}
			});
		}
	}

	renderTopicParent() {
		if (this.state.parentTopic == null) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else if (this.state.parentTopic.id) {
			return (
				<div>
					<h4>
						Parent topic: <Link className="" to={"/topic/" + this.state.parentTopic.id}>{this.state.parentTopic.name}</Link>
					</h4>
				</div>
			);
		} else {
			return "";
		}
	}

	renderTopicChanges() {
		if (this.state.topicChanges == null) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else {
			return (
				<div>
					<h4>
						Changes journal
					</h4>
					<table id="topicChangesTable" width="100%">
						<tbody>
							<thead>
								<tr>
									<th>Date</th>
									<th>User</th>
									<th>Old name</th>
									<th>New name</th>
								</tr>
							</thead>
							<tbody>
								{this.renderTopicChangesTableData()}
							</tbody>
						</tbody>
					</table>
				</div>
			);
		}
	}

	renderTopicChangesTableData() {
		if (this.state.topicChanges.length > 0) {
			return this.state.topicChanges.map((topicChange) => {
				return (
					<tr>
						<td>{moment.utc(topicChange.creationDate).local().format('YYYY-MM-DD hh:mm')}</td>
						<td>{topicChange.creator.firstName} {topicChange.creator.lastName}</td>
						<td>{topicChange.oldName}</td>
						<td>{topicChange.newName}</td>
					</tr>
				);
			});
		} else {
			return (<tr>
				<td colSpan="4">No changes</td>
			</tr>);
		}
	}


	render() {
		if (this.state.topic == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">

						<h1>{this.state.topic.name}</h1>
						<Link className="button" to={"/topic/" + this.state.topic.id + "/edit"}>
							<button>Edit</button>
						</Link>
						<h3>Created on: {moment.utc(this.state.topic.creationDate).local().format('YYYY-MM-DD HH:mm')}</h3>
						{this.renderTopicParent()}

						<p className="margin-top-16">
							{this.state.topic.references}
						</p>

						<p className="margin-top-16">
							{this.renderTopicChanges()}
						</p>

					</div>
				</Layout>
			);
		}
	}
}

export default Topic;