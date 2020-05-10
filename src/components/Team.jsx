import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faStar, faUser, faCalendarAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { teamService } from "../services/teamService.js";
import { userService } from "../services/userService.js";
import { auth } from "../services/auth.js";


class Team extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			leader: null,
			teamMembers: null,
			listItems: null
		};
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
		var id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		if (id === auth.user.id) {
			this.setState({
				leader: auth.user
			});
		} else {
			var result = await userService.fetchUserById(id);
			if (result.isSuccess === true) {
				this.setState({
					leader: result.content[0]
				});
			} else {
				console.log(JSON.stringify(result));
			}
		}

		var result = null;
		if (id == auth.user.id) {
			result = await teamService.fetchCurrentUserTeam();
		} else {
			result = await teamService.fetchTeamByLeaderId(id);
		}

		if (result.isSuccess === true) {
			this.setState({
				teamMembers: result.content.members
			});
		} else {
			console.log(JSON.stringify(result));
		}

		this.setState({
			listItems: this.state.teamMembers.map((member) =>
				<li key={member.id}>
					<Link to={"/user/" + member.id}>

						{member.id === this.state.leader.id ?
							<FontAwesomeIcon icon={faStar} listItem /> :
							<FontAwesomeIcon icon={faUser} listItem />
						}

						{member.firstName} {member.lastName} ({member.username})
					</Link>
				</li>
			)
		});
	}
	
	render() {
		if (this.state.leader == null || this.state.listItems == null || this.state.teamMembers == null) {
			return (
				<Layout>
					<Loading showText={true}/>
				</Layout>
			);
		} else {
			return (
				<Layout>
					<div className="container wide">

						<div className="flex-right">

							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<FontAwesomeIcon icon={faUsers} size="3x" />
								<div className="flex-spacer"></div>
							</div>

							<div>
								<h1>
									Komanda
							</h1>
								<h4>
									Vadovas: <Link to={"/user/" + this.state.leader.id}>{this.state.leader.firstName} {this.state.leader.lastName}</Link>
								</h4>
							</div>

						</div>

						<h3 className="margin-top-24">Komandos nariai:</h3>

						<ul className="fa-ul">
							{this.state.listItems}
						</ul>

						<Link className="button" to={"team/add"}>
							Pridėti naują komandos narį
						</Link>

					</div>
					
					<div className="wide width-container">
						
						<div className="grid gaps">
							<Link className="button" to={"/user/" + this.state.leader.id + "/team/calendar"}>
								<div className="w100 margin-vertical-16">
									<FontAwesomeIcon icon={faCalendarAlt} size="4x" />
								</div>
								Kalendorius
							</Link>
							
							<Link className="button" to={"/user/" + this.state.leader.id + "/team/topics"}>
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faClipboardList} size="4x" />
							</div>
								Išmoktos temos
							</Link>
							
						</div>
					</div>
					
				</Layout>
			);
		}
	}
}

export default Team;