import React from 'react';
import { auth } from "../services/auth.js";
import Layout from "./Layout";
import { topicService } from "../services/topicService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";

class EditTopic extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			topic: null,
			newName: "",
			newReferences: "",
			newParentTopicId: "",
			isUpdateButtonEnabled: true,
			topics: null
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleReferencesChange = this.handleReferencesChange.bind(this);
		this.handleParentTopicIdChange = this.handleParentTopicIdChange.bind(this);
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
					Update
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

						<h1 className="margin-bottom-8">Edit {this.state.topic.name}</h1>

						<form className="flex-down" onSubmit={this.handleSubmit}>

							<label>
								Name
								<input required type="text" value={this.state.newName} onChange={this.handleNameChange} />
							</label>
							<label>
								References
								<textarea type="text" onChange={this.handleReferencesChange} >
									{this.state.newReferences}
								</textarea>
							</label>
							<label>
								Parent topic
								<select value={this.state.newParentTopicId} onChange={this.handleParentTopicIdChange}>
									<option key="" value="">None</option>
									{
										this.state.topics.map((topic) => {
											return (
												<option key={topic.id} value={topic.id}>{topic.name}</option>
											);
										})
									}
								</select>
							</label>
							<hr />

							{this.renderUpdateButton()}
						</form>
					</div>
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
					let topicReturned = data.content;

					this.setState({
						topic: topicReturned
					});
					this.notifRef.current.addNotification({ text: "Updated successfully", isSuccess: true });
					this.props.history.push("/topic/" + topicReturned.id + "/edit");
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isUpdateButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default EditTopic;