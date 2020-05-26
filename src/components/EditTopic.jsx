import React from 'react';
import Layout from "./Layout";
import { topicService } from "../services/topicService.js";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { languageService } from "../services/languageService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ConcurrencyErrorModal from './ConcurrencyErrorModal';

class EditTopic extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			topic: null,
			newName: "",
			newReferences: "",
			newParentTopicId: "",
			isUpdateButtonEnabled: true,
			topics: null,
			//for concurrency
			isConcurrencyModalActive: false,
			concurrencyTopic: null,
			concurrencyName: "",
			concurrencyReferences: "",
			concurrencyParentTopic: null,
			concurrencyTopicHasChanged: false
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleReferencesChange = this.handleReferencesChange.bind(this);
		this.handleParentTopicIdChange = this.handleParentTopicIdChange.bind(this);
		this.handleConcurrencyOverwrite = this.handleConcurrencyOverwrite.bind(this);
		this.handleConcurrencyUpdateFields = this.handleConcurrencyUpdateFields.bind(this);
		this.handleConcurrencyCompareChanges = this.handleConcurrencyCompareChanges.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

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
		let result = await topicService.fetchTopics();
		if (result.isSuccess === true) {
			let topic = result.content.filter(t => t.id === id)[0];
			//remove current topic
			let topicIndex = result.content.indexOf(topic);
			result.content.splice(topicIndex, 1);
			//remove children of current topic
			let childrenOfTopic = result.content.filter(t => t.parentId === id);
			for (let i = 0; i < childrenOfTopic.length; i++) {
				let index = result.content.indexOf(childrenOfTopic[i]);
				result.content.splice(index, 1);
			}

			this.setState({
				topics: result.content,
				topic: topic,
				newName: topic.name,
				newReferences: topic.references,
				newParentTopicId: topic.parentId
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderUpdateButton() {
		if (this.state.isUpdateButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isUpdateButtonEnabled}>
					{languageService.translate("Update")}
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.topic == null || this.state.topics === null) {
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
								<Link className="button back-button" to={"/topic/" + this.state.topic.id}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1 className="margin-bottom-8">{languageService.translate("EditTopic.Title", { name: this.state.topic.name })}</h1>
						</div>

						<form className="flex-down" onSubmit={this.handleSubmit}>

							<label>
								{languageService.translate("EditTopic.Name")}
								<input required type="text" value={this.state.newName} onChange={this.handleNameChange} />
								{this.state.concurrencyName ?
									<div style={{ color: "red" }}>
										{languageService.translate("ConcurrencyErrorModal.ValueFromDatabase")} : {this.state.concurrencyName}
									</div>
									: ""}
							</label>
							<label>
								{languageService.translate("EditTopic.References")}
								<textarea type="text" onChange={this.handleReferencesChange}>
									{this.state.newReferences}
								</textarea>
								{this.state.concurrencyReferences ?
									<div style={{ color: "red" }}>
										{languageService.translate("ConcurrencyErrorModal.ValueFromDatabase")} : {this.state.concurrencyReferences}
									</div>
									: ""}
							</label>
							<label>
								{languageService.translate("EditTopic.ParentTopic")}
								<select value={this.state.newParentTopicId} onChange={this.handleParentTopicIdChange}>
									<option key="" value="">{languageService.translate("None")}</option>
									{
										this.state.topics.map((topic) => {
											return (
												<option key={topic.id} value={topic.id}>{topic.name}</option>
											);
										})
									}
								</select>
								{this.state.concurrencyTopicHasChanged ?
									(this.state.concurrencyParentTopic ? 
										<div style={{ color: "red" }}>
											{languageService.translate("ConcurrencyErrorModal.ValueFromDatabase")} : {this.state.concurrencyParentTopic.name}
										</div> :
										<div style={{ color: "red" }}>
											{languageService.translate("ConcurrencyErrorModal.ValueFromDatabase")} : {languageService.translate("None")}
										</div>) :
									""}
							</label>
							<hr />

							{this.renderUpdateButton()}
						</form>
					</div>

					<ConcurrencyErrorModal
						isEnabled={this.state.isConcurrencyModalActive}
						handleOverwrite={this.handleConcurrencyOverwrite}
						handleUpdateFields={this.handleConcurrencyUpdateFields}
						handleCompareChanges={this.handleConcurrencyCompareChanges}
					/>

				</Layout>
			);
		}
	}

	handleNameChange(event) {
		this.setState({ newName: event.target.value });
	}

	handleReferencesChange(event) {
		this.setState({ newReferences: event.target.value });
	}

	handleParentTopicIdChange(event) {
		this.setState({ newParentTopicId: event.target.value });
	}

	handleConcurrencyCompareChanges(event) {

		let topic = this.state.concurrencyTopic;
		let originalTopic = this.state.topic;

		this.setState({
			concurrencyName: originalTopic === topic.name ? "" : topic.name,
			concurrencyReferences: originalTopic.references === topic.references ? "" : topic.references,
			concurrencyParentTopic: originalTopic.parentTopicId === topic.parentTopicId ? null : (topic.parentTopicId ? this.state.topics.filter((t) => t.id === topic.parentTopicId) : null),
			isConcurrencyModalActive: false,
			concurrencyTopicHasChanged: originalTopic.parentTopicId !== topic.parentTopicId
		});

		this.notifRef.current.addNotification({ text: languageService.translate("ConcurrencyErrorModal.ValuesFromDatabaseLoaded"), isSuccess: true });

		event.preventDefault();
	}

	handleConcurrencyUpdateFields(event) {

		let topic = this.state.concurrencyTopic;

		this.setState({
			topic: topic,
			concurrencyTopic: null,
			newName: topic.name,
			newReferences: topic.references,
			newParentTopicId: topic.parentId,
			isConcurrencyModalActive: false
		});

		this.notifRef.current.addNotification({ text: languageService.translate("ConcurrencyErrorModal.FieldsHaveBeenUpdated"), isSuccess: true });

		event.preventDefault();
	}

	handleConcurrencyOverwrite(event) {

		let concurrencyTopic = this.state.concurrencyTopic;
		let topicCurrent = this.state.topic;

		//update row version
		topicCurrent.rowVersion = concurrencyTopic.rowVersion;

		this.setState({
			topic: topicCurrent,
			concurrencyTopic: null,
			isConcurrencyModalActive: false
		});

		//manually submit form
		this.handleSubmit(event);

		event.preventDefault();
	}

	handleSubmit(event) {
		let topicToUpdate = this.state.topic;
		topicToUpdate.name = this.state.newName;
		topicToUpdate.references = this.state.newReferences;
		topicToUpdate.parentId = this.state.newParentTopicId;

		this.setState({
			isUpdateButtonEnabled: false
		});

		topicService.updateTopic(topicToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					let topicReturned = data.content[0];

					this.setState({
						topic: topicReturned
					});

					this.notifRef.current.addNotification({ text: languageService.translate("EditTopic.SuccessMessage"), isSuccess: true });

					let thisUp = this;
					//Give some time to read message
					setTimeout(function () {
						thisUp.props.history.push("/topic/" + topicReturned.id);
					}, 1000);
				} else {

					//handle concurrency error
					if (data.errorCodes && data.errorCodes.indexOf("ConcurrencyException") > -1) {
						this.setState({
							isConcurrencyModalActive: true,
							concurrencyTopic: data.content
						});
					} else {
						this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
					}
				}

				this.setState({
					isUpdateButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default EditTopic;