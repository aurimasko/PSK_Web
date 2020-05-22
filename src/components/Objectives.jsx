import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faTimes, faCheckDouble, faHistory } from '@fortawesome/free-solid-svg-icons'
import Loading from "./Loading";
import ObjectiveHistoryModal from "./ObjectiveHistoryModal";
import { auth } from "../services/auth.js";
import { userService } from "../services/userService.js";
import { objectiveService } from "../services/objectiveService.js";
import { objectiveChangeService } from "../services/objectiveChangeService.js";
import moment from 'moment';
import { responseHelpers } from "../helpers/responseHelpers.js";
import { languageService } from "../services/languageService.js";

class Objectives extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			user: null,
			objectives: null,
			historyModalIsEnabled: false,
			selectedObjective: null,
			historyList: null,
			areButtonsEnabled: true
		};

		this.notifRef = React.createRef();
		
		this.handleAccept = this.handleAccept.bind(this);
		this.handleDecline = this.handleDecline.bind(this);
		this.handleFinish = this.handleFinish.bind(this);
		this.handleHistory = this.handleHistory.bind(this);
		this.handleHistoryModalClose = this.handleHistoryModalClose.bind(this);
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
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		if (id === auth.user.id) {
			this.setState({
				user: auth.user
			});

			this.getObjectives(auth.user.id);
		} else {
			let result = await userService.fetchUserById(id);
			if (result.isSuccess === true) {
				this.setState({
					user: result.content[0]
				});

				this.getObjectives(result.content[0].id);
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		}
	}

	async getObjectives(id) {
		let result = await objectiveService.fetchObjectivesByUserId(id);
		if (result.isSuccess === true) {
			this.setState({
				objectives: result.content.sort((a, b) => b.creationDate - a.creationDate)
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderAddButton() {
		//current user cannot create objectives for himself
		if (auth.user.id === this.state.user.id) {
			return "";
		} else {
			return (
				<Link className="button primary margin-top-32" to={"/user/" + this.state.user.id + "/objectives/add"}>
					{languageService.translate("Objectives.AddNew")}
				</Link>
			);
		}
	}

	render() {
		if (this.state.user === null || this.state.objectives === null) {
			return <Loading />
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">
						<div className="flex-right">
							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<Link className="button back-button" to={"/user/" + this.props.match.params.id}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>
								{languageService.translate("Objectives.Title", { name: this.state.user.firstName + " " + this.state.user.lastName })}
							</h1>
						</div>

						{this.renderObjectivesList()}

						{this.renderAddButton()}
					</div>

					<ObjectiveHistoryModal
						isEnabled={this.state.historyModalIsEnabled}
						selectedObjective={this.state.selectedObjective}
						historyList={this.state.historyList}
						handleClose={this.handleHistoryModalClose}
					/>

				</Layout>
			);
		}
	}
	
	renderObjectivesList() {
		
		if (this.state.objectives === null) {
			return <Loading />;
		}
		
		if (this.state.objectives.length === 0) {
			return languageService.translate("Objectives.NoObjectives");
		}
		
		const listItems = this.state.objectives.map((objective) =>
			<li className="margin-top-16 flex-right flex-wrap" key={objective.id}>
				
				<div>
					<div>
						<span className="bold">{languageService.translate("Objectives.Topic")}: </span>
						<Link className="bold" to={"/topic/" + objective.topicId}>
							{objective.topic.name}
						</Link>
					</div>
					
					<div>
						<span className="bold">{languageService.translate("Objectives.Date")}: </span>
						{moment.utc(objective.creationDate).local().format('YYYY-MM-DD')}
					</div>
					<div>
						<span className="bold">{languageService.translate("Objectives.Status")}: </span>
						{languageService.translate("Objectives." + objective.status)}
					</div>
					{objective.deadline ?
						<div>
							<span className="bold">{languageService.translate("Objectives.Deadline")}: </span>
							{moment.utc(objective.deadline).local().format('YYYY-MM-DD')}
						</div> : ""}
					<div>
						<span className="bold">{languageService.translate("Objectives.Creator")}: </span>
						{objective.creator.firstName} {objective.creator.lastName}
					</div>
				</div>
				
				{this.renderListItemButtons(objective)}
			</li>
		);
		
		return (
			<div className="margin-left-32 margin-top-24">
				{listItems}
			</div>
		);
	}
	
	renderListItemButtons(objective) {
		
		let extraButtons;

		//let actions only for current user
		if (objective.objectiveHaverId === auth.user.id) {
			if (objective.status === "Created") {
				extraButtons = (
					<>
						<button className="button" onClick={() => this.handleAccept(objective.id)}>
							<div>
								<FontAwesomeIcon icon={faCheck} />
							</div>
							{languageService.translate("Objectives.Accept")}
						</button>
						<button className="button" onClick={() => this.handleDecline(objective.id)}>
							<div>
								<FontAwesomeIcon icon={faTimes} />
							</div>
							{languageService.translate("Objectives.Decline")}
						</button>
					</>
				);
			}

			if (objective.status === "Accepted") {
				extraButtons = (
					<button className="button" onClick={() => this.handleFinish(objective.id)}>
						<div>
							<FontAwesomeIcon icon={faCheckDouble} />
						</div>
						{languageService.translate("Objectives.Complete")}
					</button>
				);
			}
		}

		if (!this.state.areButtonsEnabled) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else {
			return (
				<div className="flex-right flex-wrap flex-spacer">
					<div className="flex-spacer" />
					{extraButtons}

					<button className="button" onClick={() => this.handleHistory(objective.id)}>
						<div>
							<FontAwesomeIcon icon={faHistory} />
						</div>
						{languageService.translate("Objectives.History")}
					</button>
				</div>
			);
		}
	};
	
	async handleAccept(id) {
		let selectedObjective = this.state.objectives.find(x => x.id === id);
		selectedObjective.Status = "Accepted";

		await this.updateObjective(selectedObjective);
	}
	
	async handleDecline(id) {
		let selectedObjective = this.state.objectives.find(x => x.id === id);
		selectedObjective.Status = "Declined";

		await this.updateObjective(selectedObjective);
	}
	
	async handleFinish(id) {
		let selectedObjective = this.state.objectives.find(x => x.id === id);
		selectedObjective.Status = "Completed";

		await this.updateObjective(selectedObjective);
	}
	
	async handleHistory(id) {
		this.setState({
			historyModalIsEnabled: true
		});

		let result = await objectiveChangeService.fetchObjectiveChangesForObjective(id);
		if (result.isSuccess === true) {
			let selectedObjective = this.state.objectives.find(x => x.id === id);
			let historyList = result.content.sort((a, b) => b.creationDate - a.creationDate);

			//add creation record if doesn't exists
			var filteredHistoryList = historyList.filter((h) => h.oldState === null);

			let finalHistoryList = [];
			if (filteredHistoryList.length === 0) {
				let creationRecord = {
					oldState: "-",
					newState: languageService.translate("Objectives.Created"),
					objectiveId: id,
					creationDate: selectedObjective.creationDate,
					creator: selectedObjective.creator
				};

				finalHistoryList.push(creationRecord);
				finalHistoryList.concat(historyList);
			} else {
				finalHistoryList = historyList;
			}

			this.setState({
				selectedObjective: selectedObjective,
				historyList: finalHistoryList
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}
	
	handleHistoryModalClose() {
		this.setState({
			historyModalIsEnabled: false,
			selectedObjective: null,
			historyList: null
		});
	}

	async updateObjective(objective) {
		this.setState({
			areButtonsEnabled: false
		});

		objectiveService.updateObjective(objective)
			.then((data) => {
				if (data.isSuccess) {
					this.getData();
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					areButtonsEnabled: true
				});
			});
	}
}

export default Objectives;