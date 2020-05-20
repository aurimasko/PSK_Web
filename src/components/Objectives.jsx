import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faTimes, faCheckDouble, faHistory, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Loading from "./Loading";
import ObjectiveHistoryModal from "./ObjectiveHistoryModal";
import { auth } from "../services/auth.js";
import { userService } from "../services/userService.js";
import { objectiveService } from "../services/objectiveService.js";
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
			historyList: []
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
				objectives: result.content.sort((a, b) => b.date - a.date)
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
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

						<Link className="button primary margin-top-32" to={"/user/" + this.state.user.id + "/objectives/add"}>
							{languageService.translate("Objectives.AddNew")}
						</Link>
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
						<Link className="bold" to={"/topic/" + objective.id}>
							{objective.name}
						</Link>
					</div>
					
					<div>
						<span className="bold">{languageService.translate("Objectives.Date")}: </span>
						{moment.utc(objective.creationDate).local().format('YYYY-MM-DD hh:mm')}
					</div>
					<div>
						<span className="bold">{languageService.translate("Objectives.Status")}: </span>
						{languageService.translate("Objectives." + objective.status)}
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
		
		if (objective.status === "Created") {
			extraButtons = (
				<>
					<button className="button" onClick={ () => this.handleAccept(objective.id) }>
						<div>
							<FontAwesomeIcon icon={faCheck} />
						</div>
						{languageService.translate("Objectives.Accept")}
					</button>
					<button className="button" onClick={ () => this.handleDecline(objective.id) }>
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
				<button className="button" onClick={ () => this.handleFinish(objective.id) }>
					<div>
						<FontAwesomeIcon icon={faCheckDouble} />
					</div>
					{languageService.translate("Objectives.Complete")}
				</button>
			);
		}
		
		return (
			<div className="flex-right flex-wrap flex-spacer">
				<div className="flex-spacer" />
				{extraButtons}
				
				<button className="button" onClick={ () => this.handleHistory(objective.id) }>
					<div>
						<FontAwesomeIcon icon={faHistory} />
					</div>
					{languageService.translate("Objectives.History")}
				</button>
			</div>
		);
	};
	
	handleAccept(id) {
		alert("accept functionality is not implemented");
	}
	
	handleDecline(id) {
		alert("decline functionality is not implemented");
	}
	
	handleFinish(id) {
		alert("finish functionality is not implemented");
	}
	
	handleHistory(id) {



		this.setState({
			historyModalIsEnabled: true,
			selectedObjective: this.state.objectives.find( x => x.id === id),
			historyList: [
				{
					date: "2020-20-20",
					user: {
						firstName: "Vardaitis",
						lastName: "Pavardaitis"
					},
					oldState: "none",
					newState: "created"
				},
				{
					date: "2021-21-21",
					user: {
						firstName: "Pavardis",
						lastName: "Vardis"
					},
					oldState: "created",
					newState: "accepted"
				}
			]
		});
	}
	
	handleHistoryModalClose() {
		this.setState({
			historyModalIsEnabled: false,
			selectedObjective: null,
			historyList: []
		});
	}
}

export default Objectives;