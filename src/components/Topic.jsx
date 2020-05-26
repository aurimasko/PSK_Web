import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Loading from "../components/Loading";
import { topicService } from "../services/topicService.js";
import { topicChangesService } from "../services/topicChangesService.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import moment from 'moment';
import { languageService } from "../services/languageService.js";

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
			this.getTopicChanges(result.content[0].id);
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	async getTopicChanges(id) {
		let result = await topicChangesService.fetchTopicChangesForTopic(id);
		if (result.isSuccess === true) {
			let topicChanges = result.content;
			//sort by date
			let sortedTopicChanges = topicChanges.sort((a, b) => moment.utc(b.creationDate) - moment.utc(a.creationDate));
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
						{languageService.translate("Topic.ParentTopic")}: <Link className="" to={"/topic/" + this.state.parentTopic.id}>{this.state.parentTopic.name}</Link>
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
						{languageService.translate("Topic.ChangesJournal")}
					</h4>
					<table id="topicChangesTable" width="100%">
						<tbody>
							<thead>
								<tr>
									<th>{languageService.translate("TopicChangesJournal.Date")}</th>
									<th>{languageService.translate("TopicChangesJournal.User")}</th>
									<th>{languageService.translate("TopicChangesJournal.OldName")}</th>
									<th>{languageService.translate("TopicChangesJournal.NewName")}</th>
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
						<td>{moment.utc(topicChange.creationDate).local().format('YYYY-MM-DD hh:mm:ss')}</td>
						<td>{topicChange.creator.firstName} {topicChange.creator.lastName}</td>
						<td>{topicChange.oldName}</td>
						<td>{topicChange.newName}</td>
					</tr>
				);
			});
		} else {
			return (<tr>
				<td colSpan="4">{languageService.translate("NoChanges")}</td>
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
						<div className="flex-right">
							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<Link className="button back-button" to={"/topics"}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>{this.state.topic.name}</h1>
						</div>

						<Link className="button" to={"/topic/" + this.state.topic.id + "/edit"}>
							<button>{languageService.translate("Edit")}</button>
						</Link>
						<h3>{languageService.translate("Topic.CreatedOn")}: {moment.utc(this.state.topic.creationDate).format('YYYY-MM-DD HH:mm')}</h3>
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