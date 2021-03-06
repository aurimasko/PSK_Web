import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersCog, faUserPlus, faNotesMedical, faUsers, faStar, faUser, faCalendarAlt, faClipboardList, faProjectDiagram, faColumns } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { teamService } from "../services/teamService.js";
import { userService } from "../services/userService.js";
import { auth } from "../services/auth.js";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { sortHelpers } from "../helpers/sortHelpers.js";
import { languageService } from "../services/languageService.js";

class Team extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			leader: null,
			teamMembers: null,
			listItems: null
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
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		if (id === auth.user.id) {
			this.setState({
				leader: auth.user
			});
		} else {
			let result = await userService.fetchUserById(id);
			if (result.isSuccess === true) {
				this.setState({
					leader: result.content[0]
				});
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		}

		let result = null;
		if (id === auth.user.id) {
			result = await teamService.fetchCurrentUserTeam();
		} else {
			result = await teamService.fetchTeamByLeaderId(id);
		}

		if (result.isSuccess === true) {
			let teamMembers = result.content.members;

			//sort by name
			let sortedTeamMembers = sortHelpers.sortUsersByFirstNameAndLastName(teamMembers);

			this.setState({
				teamMembers: sortedTeamMembers,
				listItems: sortedTeamMembers.map((member) =>
					<li key={member.id}>
						<Link to={"/user/" + member.id} title={member.username}>

							{member.id === this.state.leader.id ?
								<FontAwesomeIcon icon={faStar} listItem /> :
								<FontAwesomeIcon icon={faUser} listItem />
							}

							{member.firstName} {member.lastName}
					</Link>
					</li>
				)
			});

		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderAddNewTeamMemberButton() {
		if (this.state.leader.id === auth.user.id) {
			return (
				<Link className="unbold margin-right-16 margin-top-8" to={"team/add"}>
					<FontAwesomeIcon className="margin-right-4" icon={faUserPlus} />
					{languageService.translate("Add")}
				</Link>
			);
		} else {
			return "";
		}
	}

	renderTeamMembers() {
		if (this.state.listItems == null) {
			return <Loading width={50} height={50} type={"balls"} />;
		}else if (this.state.listItems.length > 0) {
			return (
				<div>
					
					<div className="margin-bottom-16">
						<h2 className="margin-top-24 margin-right-16 inline-block">{languageService.translate("Team.Members")}:</h2>
						
						{this.renderAddNewTeamMemberButton()}
						{this.renderObjectiveAndLimitButtons()}
					</div>
					
					<ul className="fa-ul">
						{this.state.listItems}
					</ul>
				</div>
			);
		} else {
			return "";
		}
	}

	renderButtons() {
		if (this.state.teamMembers === null || (this.state.teamMembers !== null && this.state.teamMembers.length === 0)) {
			return (
				<div className="wide width-container">
				
					<div className="grid gaps">
						<Link className="button disabled">
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faCalendarAlt} size="4x" />
							</div>
							{languageService.translate("Team.Calendar")}
						</Link>
						
						<Link className="button disabled">
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faClipboardList} size="4x" />
							</div>
							{languageService.translate("Team.LearnedTopics")}
						</Link>
						
					</div>
				</div>
			);
		} else {
			return (
				<div className="grid gaps">
					
					<Link className="button align-left" to={"/user/" + this.state.leader.id + "/team/calendar"}>
						<FontAwesomeIcon className="margin-right-8" icon={faCalendarAlt} />
						{languageService.translate("Team.Calendar")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.leader.id + "/team/learningpath"}>
						<FontAwesomeIcon className="margin-right-8" icon={faProjectDiagram} />
						{languageService.translate("Team.LearningPath")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.leader.id + "/team/learningplan"}>
						<FontAwesomeIcon className="margin-right-8" icon={faColumns} />
						{languageService.translate("Team.LearningPlan")}
					</Link>
					
				</div>
			);
		}
	}

	renderObjectiveAndLimitButtons() {
		//only team leader can add team objectives and change team limit
		if (this.state.leader.id !== auth.user.id) {
			return "";
		}

		if (this.state.teamMembers === null || (this.state.teamMembers !== null && this.state.teamMembers.length === 0)) {
			return (
				<>
					<Link className="unbold margin-right-16 margin-top-8 disabled">
						<FontAwesomeIcon className="margin-right-4" icon={faNotesMedical} />
						{languageService.translate("Team.AddObjective")}
					</Link>
					<Link className="unbold margin-right-16 margin-top-8 disabled">
						<FontAwesomeIcon className="margin-right-4" icon={faUsersCog} />
						{languageService.translate("Team.ChangeLimit")}
					</Link>
				</>);

		} else {
			return (
				<>
					<Link className="unbold margin-right-16 margin-top-8" to={"team/addobjective"}>
						<FontAwesomeIcon className="margin-right-4" icon={faNotesMedical} />
						{languageService.translate("Team.AddObjective")}
					</Link>
					<Link className="unbold margin-right-16 margin-top-8" to={"team/changelimit"}>
						<FontAwesomeIcon className="margin-right-4" icon={faUsersCog} />
						{languageService.translate("Team.ChangeLimit")}
					</Link>
				</>);
		}
	}

	render() {
		if (this.state.leader == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true}/>
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					
					<div className="container wide">
						
						<div className="flex-right">
							
							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<FontAwesomeIcon icon={faUsers} size="3x" />
								<div className="flex-spacer"></div>
							</div>
							
							<div>
								<h1>
									{languageService.translate("Team.Title")}
								</h1>
								<h4>
									{languageService.translate("Team.Leader")}: <Link to={"/user/" + this.state.leader.id}>{this.state.leader.firstName} {this.state.leader.lastName}</Link>
								</h4>
							</div>
							
						</div>
						
						<hr />
							{this.renderButtons()}
						<hr />
						
						{this.renderTeamMembers()}
						
					</div>
					
				</Layout>
			);
		}
	}
}

export default Team;