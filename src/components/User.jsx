import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendarAlt, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../services/auth.js";
import { roleService } from "../services/roleService.js";
import { userService } from "../services/userService.js";
import moment from 'moment';
import Loading from "../components/Loading";

class User extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			role: null,
			user: null
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
		var id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		if (id === auth.user.id) {
			this.setState({
				user: auth.user
			});

			this.getRole(auth.user.roleId);
		} else {
			var result = await userService.fetchUserById(id);
			if (result.isSuccess === true) {
				this.setState({
					user: result.content[0]
				});

				this.getRole(result.content[0].roleId);
			} else {
				console.log(JSON.stringify(result));
			}
		}
	}

	async getRole(roleId) {
		if (roleId) {
			var result = await roleService.fetchRole(roleId);
			if (result.isSuccess === true) {
				this.setState({
					role: result.content[0]
				});
			} else {
				console.log(JSON.stringify(result));
			}
		} else {
			this.setState({
				role: {}
			});
		}
	}
	
	renderRole() {
		if (this.state.role == null) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else {
			if (this.state.role.id) {
				return (
					<h4>
						Role: <Link className="" to={"/role/" + this.state.role.id}>{this.state.role.name}</Link>
					</h4>);
			} else {
				return "";
			}
		}
	}

	renderButtons() {
		//Admin can do anything
		if (auth.user.isAdmin) {
			return (
				<div>
					<Link className="button" to={"/user/" + this.state.user.id + "/edit"}>
						<button>Edit</button>
					</Link>
					<Link className="button" to={"/user/" + this.state.user.id + "/changerole"}>
						<button>Change role</button>
					</Link>
					<button>Change password</button>
					<button>Change supervisor</button>
				</div>
			);
		} else {
			//if current user, can change password and update himself
			if (this.state.user.id === auth.user.id) {
				return (
					<div>
						<Link className="button" to={"/user/" + this.state.user.id + "/edit"}>
							<button>Edit</button>
						</Link>
						<Link className="button" to={"/user/me/changepassword"}>
							<button>Change password</button>
						</Link>
					</div>
				);
				//if supervisor, can update only role
			} else if (this.state.user.superVisorId === auth.user.id) {
				return (
					<Link className="button" to={"/user/" + this.state.user.id + "/changerole"}>
						<button>Change role</button>
					</Link>
				);
				//if any higher in heirarchy, can update role and change supervisor
			} else {
				return (
					<div>
						<Link className="button" to={"/user/" + this.state.user.id + "/changerole"}>
							<button>Change role</button>
						</Link>
						<button>Change supervisor</button>
					</div>
				);
			}
		}
	}

	render() {
		if (this.state.user == null) {
			return (
				<Layout>
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
								<FontAwesomeIcon icon={faUser} size="3x" />
								<div className="flex-spacer"></div>
							</div>
							
							<div>
								<h1>
									{this.state.user.firstName} {this.state.user.lastName}
								</h1>
								{this.renderRole()}
							</div>
							
						</div>
						
						<div className="wide width-container">
							
							<div className="grid gaps">
								<Link className="button" to={"/user/" + this.state.user.id + "/calendar"}>
									<div className="w100 margin-vertical-16">
										<FontAwesomeIcon icon={faCalendarAlt} size="3x" />
									</div>
									Calendar
								</Link>
								
								<Link className="button" to={"/user/" + this.state.user.id + "/topics"}>
								<div className="w100 margin-vertical-16">
									<FontAwesomeIcon icon={faClipboardList} size="3x" />
								</div>
									Learned topics
								</Link>
								
								<Link className="button" to={"/user/" + this.state.user.id + "/team"}>
									<div className="w100 margin-vertical-16">
										<FontAwesomeIcon icon={faUsers} size="3x" />
									</div>
									Team
								</Link>
								
							</div>
						</div>
						
						<div className="margin-top-16">
							<strong>Email address: </strong> {this.state.user.username}
						</div>
						
						<div>
							<strong>Registration date: </strong> {moment.utc(this.state.user.creationDate).format('YYYY-MM-DD hh:mm')}
						</div>
						<div>
							<strong>Learning day limit per quarter: </strong> {this.state.user.learningDayLimitPerQuarter}
						</div>

						{this.renderButtons()}
						
					</div>
				</Layout>
			);
		}
	}
}

export default User;