import React from 'react';
import Layout from "./Layout";
import { objectiveService } from "../services/objectiveService.js";
import { topicService } from "../services/topicService.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { languageService } from "../services/languageService.js";

class AddObjective extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			topicId: "",
			isAddButtonEnabled: true,
			topics: null
		}

		this.handleTopicIdChange = this.handleTopicIdChange.bind(this);
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
				topics: result.content,
				topicId: result.content[0].id
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderAddButton() {
		if (this.state.isAddButtonEnabled) {
			return (
				<input className="primary" type="submit" value={languageService.translate("Add")} />
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

						<h1 className="margin-bottom-8">{languageService.translate("AddObjective.Title")}</h1>

						<form className="flex-down" onSubmit={this.handleSubmit}>
							<label>
								{languageService.translate("AddObjective.Topic")}
								<select value={this.state.topicId} onChange={this.handleTopicIdChange}>
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

	handleTopicIdChange(event) {
		this.setState({ topicId: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isAddButtonEnabled: false
		});

		objectiveService.createObjective(this.props.match.params.id, this.state.topicId)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("AddObjective.SuccessMessage"), isSuccess: true });

					//clear fields
					this.setState({
						topicId: ""
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

export default AddObjective;