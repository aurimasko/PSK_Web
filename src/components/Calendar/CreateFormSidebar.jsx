import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Loading from "../../components/Loading";
import { topicService } from "../../services/topicService.js";
import { learningDayService } from "../../services/learningDayService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";

class DayContentSidebar extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			topics: null,
			selectedTopics: [],
			comment: "",
			date: props.date,
			isSaveButtonEnabled: true,
			//editing stuff
			isEditing: props.isEditing,
			learningDayId: props.learningDayId,
			learningDayForEditing: null,
			showSelect: true
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
		if (prevProps.date !== this.props.date ||
			prevProps.isEditing !== this.props.isEditing) {
			this.setState({
				date: this.props.date,
				isEditing: this.props.isEditing
			});
		}
	}

	async getData() {

		let result = await topicService.fetchTopics();
		if (result.isSuccess === true) {
			this.setState({
				topics: result.content
			});

			//if editing, fill in the information
			if (this.state.isEditing) {
				var learningDayResult = await learningDayService.fetchLearningDaysById(this.state.learningDayId);
				if (learningDayResult.isSuccess === true) {
					let learningDay = learningDayResult.content[0];
					this.setState({
						learningDayForEditing: learningDay,
						comment: learningDay.comments,
						selectedTopics: result.content.filter(t => learningDay.topicsId.indexOf(t.id) > -1)
					});

				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(learningDayResult) });
				}
			}

		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}

	}

	renderSaveButton() {
		if (this.state.isSaveButtonEnabled) {
			return (
				<input className="primary" type="submit" value={languageService.translate("CreateLearningDay.Save")} />
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	renderSelect() {
		if (!this.state.showSelect) {
			return "";
		} else {
			return (
				<label>
					{languageService.translate("CreateLearningDay.SelectToAddMore")}
					<select value={0} onChange={this.handleTopicAdd}>
						<option key="" value="">{languageService.translate("None")}</option>
						{
							//filter out selected topics out of dropdown
							this.state.topics.filter(t => this.state.selectedTopics.indexOf(t) === -1).map((topic) => {
								return (
									<option key={topic.id} value={topic.id}>{topic.name}</option>
								);
							})
						}
					</select>
				</label>
			);
		}
	}

	render() {
		//if editing, wait for learning day to load
		if (this.state.topics === null || (this.state.isEditing && this.state.learningDayForEditing === null)) {
			return (
				<Loading showText={true} />
			);
		} else {
			return (
				<>
					<form className="flex-down flex-spacer" onSubmit={this.handleSubmit}>
						{languageService.translate("CreateLearningDay.Topics")}
						{this.renderSelectedTopics()}

						{this.renderSelect()}
						<label>
							{languageService.translate("CreateLearningDay.Comment")}					
							<textarea value={this.state.comment} onChange={this.handleCommentChange}></textarea>
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
			return <i>{languageService.translate("CreateLearningDay.NoTopicsSelected")}</i>;
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

		let topicObj = this.state.topics.filter(t => t.id === event.target.value)[0];
		newTopics.push(topicObj);
		
		this.setState({ selectedTopics: newTopics });

		//if there are 4 topics already, hide select
		if (newTopics.length === 4) {
			this.setState({ showSelect: false });
		}
	}
	
	handleTopicRemove(index, e) {
		e.preventDefault();
		
		let newTopics = this.state.selectedTopics;
		newTopics.splice(index, 1);
		
		this.setState({ selectedTopics: newTopics });

		//if there are less then 4 topics, display select
		//if there are 4 topics already, hide select
		if (newTopics.length < 4) {
			this.setState({ showSelect: true });
		}
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

		//edit
		if (this.state.isEditing) {
			//create copy
			let learningDayToUpdate = Object.assign({}, this.state.learningDayForEditing);
			learningDayToUpdate.comments = this.state.comment;
			learningDayToUpdate.topicsId = topicIds;


			learningDayService.updateLearningDay(learningDayToUpdate)
				.then((data) => {
					if (data.isSuccess) {
						this.notifRef.current.addNotification({ text: languageService.translate("CreateLearningDay.UpdateSuccessMessage"), isSuccess: true });
						this.props.handleExitEditMode();
					} else {
						this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
					}

					this.setState({
						isSaveButtonEnabled: true
					});
				});

		//create
		} else {

			learningDayService.addLearningDay(this.state.date, topicIds, this.state.comment)
				.then((data) => {
					if (data.isSuccess) {
						this.notifRef.current.addNotification({ text: languageService.translate("CreateLearningDay.AddSuccessMessage"), isSuccess: true });
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
}

export default DayContentSidebar;