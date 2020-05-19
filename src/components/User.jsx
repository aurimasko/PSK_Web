import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlockAlt, faPen, faUser, faCalendarAlt, faUsers, faTasks, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../services/auth.js";
import { roleService } from "../services/roleService.js";
import { userService } from "../services/userService.js";
import moment from 'moment';
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";

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
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		if (id === auth.user.id) {
			this.setState({
				user: auth.user
			});

			this.getRole(auth.user.roleId);
		} else {
			let result = await userService.fetchUserById(id);
			if (result.isSuccess === true) {
				this.setState({
					user: result.content[0]
				});

				this.getRole(result.content[0].roleId);
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		}
	}

	async getRole(roleId) {
		if (roleId) {
			let result = await roleService.fetchRole(roleId);
			if (result.isSuccess === true) {
				this.setState({
					role: result.content[0]
				});
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			}
		} else {
			this.setState({
				role: {}
			});
		}
	}
	
	renderRole() {
		
		if (this.state.role === null) {
			return (
				<h4>
					Role: <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
				</h4>
			);
		}
		
		if (this.state.role.id) {
			return (
				<h4>
					Role: <Link className="" to={"/role/" + this.state.role.id}>{this.state.role.name}</Link>
				</h4>
			);
		}
		else {
			return (
				<h4>
					Role: <span className="unbold">none</span>
					{this.canChangeRole ? 
						<Link className="unbold margin-left-24" to={"/user/" + this.state.user.id + "/changerole"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPen} />
							edit
						</Link>:
						""
					}
				</h4>
			);
		}
		
	}
	
	renderSupervisor() {
		
		if (this.state.user === null) {
			return ( 
				<>
					<strong>Supervisor: </strong>
					<span className="inline-block">
						<Loading width={16} height={16} type={"spin"} />
					</span>
				</>
			);
		}
		
		return (
			<div>
				<strong>Supervisor: </strong> TODO
				{this.canChangeSupervisor() ?
					<Link className="unbold margin-left-24" to={"/user/" + this.state.user.id + "/changesupervisor"}>
						<FontAwesomeIcon className="margin-right-4" icon={faPen} />
						edit
					</Link>:
					""
				}
			</div>
		);
	}
	
	canEditUserInfo() {
		if (this.state.user !== null && (this.state.user.id === auth.user.id)) {
			return true;
		}
		else return false;
	}
	
	canChangePassword() {
		if (this.state.user !== null && this.state.user.id === auth.user.id) {
			return true;
		}
		else return false;
	}
	
	canChangeRole() {
		if (this.state.user !== null && (auth.user.isAdmin || this.state.user.superVisorId === auth.user.id)) {
			return true;
		}
		else return false;
	}
	
	canChangeSupervisor() {
		if (this.state.user !== null && auth.user.isAdmin) {
			return true;
		}
		else return false;
	}
	
	renderMainButtons() {
		if (this.state.user === null) {
			return (
				<div className="grid gaps">
					<Link className="button disabled">
						<div className="w100 margin-vertical-16">
							<FontAwesomeIcon icon={faCalendarAlt} size="3x" />
						</div>
						Calendar
					</Link>
					
					<Link className="button disabled">
					<div className="w100 margin-vertical-16">
						<FontAwesomeIcon icon={faTasks} size="3x" />
					</div>
						Objectives
					</Link>
					
					<Link className="button disabled">
					<div className="w100 margin-vertical-16">
						<FontAwesomeIcon icon={faClipboardCheck} size="3x" />
					</div>
						Learned topics
					</Link>
					
					<Link className="button disabled">
						<div className="w100 margin-vertical-16">
							<FontAwesomeIcon icon={faUsers} size="3x" />
						</div>
						Team
					</Link>
					
				</div>
			);
		}
		else {
			return (
				<div className="grid gaps">
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/calendar"}>
						<FontAwesomeIcon className="margin-right-8" icon={faCalendarAlt} />
						Calendar
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/objectives"}>
						<FontAwesomeIcon className="margin-right-8" icon={faTasks} />
						Objectives
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/topics"}>
						<FontAwesomeIcon className="margin-right-8" icon={faClipboardCheck} />
						Learned topics
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/team"}>
						<FontAwesomeIcon className="margin-right-8" icon={faUsers} />
						Team
					</Link>
					
				</div>
			);
		}
	}
	
	renderAttributes() {
		
		if (this.state.user === null) {
			return "";
		}
		
		if (!this.state.user.superVisorId && this.state.user.isSuperVisor) {
			return (
				<>
					<span className="badge">Admin</span>
					<span className="badge">Supervisor</span>
				</>
			);
		} else if (!this.state.user.superVisorId) {
			return <span className="badge">Admin</span>;
		} else if (this.state.user.isSuperVisor) {
			return <span className="badge">Supervisor</span>;
		} else {
			return <span className="badge">Member</span>;
		}
	}
	
	renderInfo() {
		
		if (this.state.user === null) {
			return (
				<>
					<div className="margin-top-16">
						<strong>Email address: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
					<div>
						<strong>Registration date: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
					<div>
						<strong>Learning day limit per quarter: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
				</>
			);
		}
		else {
			return (
				<>
					<div className="margin-top-16">
						<strong>Email address: </strong> {this.state.user.username}
					</div>
					<div>
						<strong>Registration date: </strong> {moment.utc(this.state.user.creationDate).local().format('YYYY-MM-DD hh:mm')}
					</div>
					<div>
						<strong>Learning day limit per quarter: </strong> {this.state.user.learningDayLimitPerQuarter}
					</div>
				</>
			);
		}
	}
	
	render() {
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
							{
								this.state.user !== null ?
								<div className="flex-right flex-wrap">
									<h1 className="margin-right-16">
										{this.state.user.firstName} {this.state.user.lastName}
									</h1>
									{this.renderAttributes()}
								</div> :
								<h1>
									Loading user...
								</h1>
							}
							
							{this.renderSupervisor()}
							{this.renderRole()}
						</div>
						
					</div>
					<hr />
					{this.renderMainButtons()}
					
					<hr />
					
					<div className="flex-right flex-wrap">
						<h2>
							More information:
						</h2>
						
						<div className="flex-spacer" />
						
						{this.canEditUserInfo() ?
							<Link className="unbold margin-right-32 margin-top-8" to={"/user/" + this.state.user.id + "/edit"}>
								<FontAwesomeIcon className="margin-right-4" icon={faPen} />
								edit
							</Link>:
							""
						}
					</div>
					
					{this.renderInfo()}
					
					{
						this.canChangePassword() ?
							<Link className="button border margin-top-32" to={"/user/me/changepassword"}>
								<FontAwesomeIcon className="margin-right-8" icon={faUnlockAlt} />
								Change password
							</Link>:
							""
					}
				</div>
			</Layout>
		);
	}
}

export default User;