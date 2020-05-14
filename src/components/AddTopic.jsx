import React from 'react';
import Layout from "./Layout";
import { topicService } from "../services/topicService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";

class AddTopic extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			references: "",
			parentTopicId: "",
			isAddButtonEnabled: true,
			topics: null
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleReferencesChange = this.handleReferencesChange.bind(this);
		this.handleParentIdChange = this.handleParentIdChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
	}

	async componentDidMount() {
		this.getData();
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

	renderAddButton() {
		if (this.state.isAddButtonEnabled) {
			return (
				<input className="primary" type="submit" value="Add" />
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.topics == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">

						<h1 className="margin-bottom-8">Add new topic</h1>

						<form className="flex-down" onSubmit={this.handleSubmit}>
							<label>
								Name
							<input required type="text" value={this.state.name} onChange={this.handleNameChange} />
							</label>
							<label>
								References
								<textarea type="text" onChange={this.handleReferencesChange} >
									{this.state.references}
								</textarea>
							</label>
							<label>
								Parent topic
								<select value={this.state.parentTopicId} onChange={this.handleParentIdChange}>
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

							{this.renderAddButton()}
						</form>
					</div>
				</Layout>
			);
		}
	}

	handleNameChange(event) {
		this.setState({ name: event.target.value });
	}

	handleReferencesChange(event) {
		this.setState({ references: event.target.value });
	}

	handleParentIdChange(event) {
		this.setState({ parentTopicId: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isAddButtonEnabled: false
		});

		topicService.createTopic(this.state.name, this.state.references, this.state.parentTopicId)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: "Topic added successfully", isSuccess: true });

					//clear fields
					this.setState({
						name: "",
						references: "",
						parentTopicId: ""
					});
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isAddButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default AddTopic;