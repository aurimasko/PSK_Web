import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faStar, faUser, faCalendarAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons'
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
				<Link className="button" to={"team/add"}>
					{languageService.translate("Team.AddNewTeamMember")}
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
					<h3 className="margin-top-24">{languageService.translate("Team.Members")}:</h3>
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
				<div className="wide width-container">

					<div className="grid gaps">
						<Link className="button" to={"/user/" + this.state.leader.id + "/team/calendar"}>
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faCalendarAlt} size="4x" />
							</div>
							{languageService.translate("Team.Calendar")}
						</Link>

						<Link className="button" to={"/user/" + this.state.leader.id + "/team/topics"}>
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faClipboardList} size="4x" />
							</div>
							{languageService.translate("Team.LearnedTopics")}
						</Link>

					</div>
				</div>
			);
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

						{this.renderTeamMembers()}

						{this.renderAddNewTeamMemberButton()}

					</div>
					
					{this.renderButtons()}
					
				</Layout>
			);
		}
	}
}

export default Team;