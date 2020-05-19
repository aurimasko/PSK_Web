import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Loading from "../../components/Loading";
import { topicService } from "../../services/topicService.js";
import { learningDayService } from "../../services/learningDayService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";

class DayContentSidebar extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			topics: null,
			selectedTopics: [],
			comment: "",
			date: props.date,
			isSaveButtonEnabled: true
		};
		
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleTopicAdd = this.handleTopicAdd.bind(this);
		this.handleTopicRemove = this.handleTopicRemove.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = props.notifRef;
	}

	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.date !== this.props.date) {
			this.setState({
				date: this.props.date
			});
		}
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

	renderSaveButton() {
		if (this.state.isSaveButtonEnabled) {
			return (
				<input className="primary" type="submit" value="Save" />
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.topics === null) {
			return (
				<Loading showText={true} />
			);
		} else {
			return (
				<>
					<form className="flex-down flex-spacer" onSubmit={this.handleSubmit}>
						Learning day topics
						{this.renderSelectedTopics()}

						<label>
							Select to add more
							<select value={0} onChange={this.handleTopicAdd}>
								<option key="" value="">None</option>
								{
									//filter out selected topics out of dropdown
									this.state.topics.filter(t => this.state.selectedTopics.indexOf(t) == -1).map((topic) => {
										return (
											<option key={topic.id} value={topic.id}>{topic.name}</option>
										);
									})
								}
							</select>
						</label>
						<label>
							Learning day comment
							
							<textarea onChange={this.handleCommentChange}></textarea>
						</label>

						<div className="flex-spacer" />

						<hr />
						{this.renderSaveButton()}
					</form>


				</>
			);
		}
	}
	
	renderSelectedTopics() {
		
		if (this.state.selectedTopics.length === 0) {
			return <i>no topics selected</i>;
		}
		
		const topics = this.state.selectedTopics.map( (topic, index) => {
				return (
					<div key={topic.id} className="flex-right">
						{topic.name}
						<div className="flex-spacer" />
						<button className="small-btn-noborder" onClick={(e) => {this.handleTopicRemove(index, e)}}>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				);
			}
		);
		
		return topics;
	}
	
	
	handleCommentChange(event) {
		this.setState({comment: event.target.value});
	}
	
	handleTopicAdd(event) {

		event.preventDefault();
		let newTopics = this.state.selectedTopics;

		//if topic already exists, don't add it
		//should never happen, since list is already filtered
		if (newTopics.filter(t => t.id === event.target.value).length > 0)
			return;

		//if there are already four topics, do not allow to add
		if (newTopics.length == 4) {
			this.notifRef.current.addNotification({ text: "Maximum of 4 topics can be added." });
			return;
		}

		let topicObj = this.state.topics.filter(t => t.id === event.target.value)[0];
		newTopics.push(topicObj);
		
		this.setState({ selectedTopics: newTopics});
	}
	
	handleTopicRemove(index, e) {
		e.preventDefault();
		
		let newTopics = this.state.selectedTopics;
		newTopics.splice(index, 1);
		
		this.setState({ selectedTopics: newTopics});
	}
	
	handleSubmit(event) {
		event.preventDefault();

		this.setState({
			isSaveButtonEnabled: false
		});

		//collect topic ids
		let topicIds = this.state.selectedTopics.map((topic) => {
			return topic.id;
		});

		learningDayService.addLearningDay(this.state.date, topicIds, this.state.comment)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: "Learning day added successfully", isSuccess: true });
					this.props.handleExitEditMode();
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isSaveButtonEnabled: true
				});
			});
	}
}

export default DayContentSidebar;