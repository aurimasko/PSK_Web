import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlockAlt, faPen, faUser, faCalendarAlt, faUsers, faTasks, faClipboardCheck, faRemoveFormat, faCross, faWindowClose, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../services/auth.js";
import { roleService } from "../services/roleService.js";
import { userService } from "../services/userService.js";
import moment from 'moment';
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { languageService } from "../services/languageService.js";

class User extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			role: null,
			user: null,
			superVisor: null,
			enableDisableButtonEnabled: true
		};
		
		this.notifRef = React.createRef();
		this.handleEnableClicked = this.handleEnableClicked.bind(this);
		this.handleDisableClicked = this.handleDisableClicked.bind(this);
		this.handleRemoveLearningDayLimitClicked = this.handleRemoveLearningDayLimitClicked.bind(this);
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
		let result = await userService.fetchUserById(id);
		if (result.isSuccess === true) {

			if (result.content.length === 0) {
				this.props.history.push("/notfound");
				return;
			}

			this.setState({
				user: result.content[0]
			});

			this.getRole(result.content[0].roleId);
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
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
					{languageService.translate("User.Role")}: <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
				</h4>
			);
		}
		
		if (this.state.role.id) {
			return (
				<h4>
					{languageService.translate("User.Role")}: {auth.user.isSuperVisor ? <Link className="" to={"/role/" + this.state.role.id}>{this.state.role.name}</Link> : <>{this.state.role.name}</>}
					{this.canChangeRole() ?
						<Link className="unbold margin-left-24" to={"/user/" + this.state.user.id + "/changerole"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPen} />
							{languageService.translate("Edit")}
						</Link> :
						""
					}
				</h4>
			);
		}
		else {
			return (
				<h4>
					{languageService.translate("User.Role")}: <span className="unbold">{languageService.translate("None")}</span>
					{this.canChangeRole() ? 
						<Link className="unbold margin-left-24" to={"/user/" + this.state.user.id + "/changerole"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPen} />
							{languageService.translate("Edit")}
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
					<strong>{languageService.translate("User.SuperVisorBadge")}: </strong>
					<span className="inline-block">
						<Loading width={16} height={16} type={"spin"} />
					</span>
				</>
			);
		}

		//if can edit and has supervisor, display it
		if (this.state.user.superVisorId && this.canChangeSupervisor()) {
			return (
				<div>
					<strong>{languageService.translate("User.SuperVisor")}: {this.state.user.superVisor ? this.state.user.superVisor.firstName + " " + this.state.user.superVisor.lastName : ""}</strong>
					<Link className="unbold margin-left-24" to={"/user/" + this.state.user.id + "/changesupervisor"}>
						<FontAwesomeIcon className="margin-right-4" icon={faPen} />
						{languageService.translate("Edit")}
					</Link>
				</div>
			);
		}
		//if only has supervisor
		else if (this.state.user.superVisorId) {
			return (
				<div>
					<strong>{languageService.translate("User.SuperVisor")}: { this.state.user.superVisor ? this.state.user.superVisor.firstName + " " + this.state.user.superVisor.lastName : "" }</strong>
				</div>
			);
		} else {
			return "";
		}
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
		if (this.state.user !== null && (!auth.user.superVisorId || this.state.user.superVisorId === auth.user.id)) {
			return true;
		}
		else return false;
	}
	
	canChangeSupervisor() {
		//if not supervisor or current user
		//then it's either an admin or higher than supervisor
		if (this.state.user !== null &&
			(this.state.user.superVisorId !== auth.user.id || !auth.user.superVisorId) &&
			this.state.user.id !== auth.user.id) {
			return true;
		}
		else return false;
	}

	canChangeLearningDayLimit() {
		//if supervisor of user or admin (he can change himself)
		if (this.state.user.superVisorId === auth.user.id ||
			!auth.user.superVisorId)
			return true;
		else
			return false;
	}

	canDisableEnableUser() {
		//any user, that can access, can enable/disable
		//except for current user
		if(auth.user.id !== this.state.user.id)
			return true;
		return false;
	}
	
	renderMainButtons() {
		if (this.state.user === null) {
			return (
				<div className="grid gaps">
					<Link className="button disabled align-left" to="#">
						<FontAwesomeIcon className="margin-right-8" icon={faCalendarAlt} />
						{languageService.translate("User.Calendar")}
					</Link>
					
					<Link className="button disabled align-left" to="#">
						<FontAwesomeIcon className="margin-right-8" icon={faTasks} />
						{languageService.translate("User.Objectives")}
					</Link>
					
					<Link className="button disabled align-left" to="#">
						<FontAwesomeIcon className="margin-right-8" icon={faClipboardCheck} />
						{languageService.translate("User.LearnedTopics")}
					</Link>
					
					<Link className="button disabled align-left" to="#">
						<FontAwesomeIcon className="margin-right-8" icon={faUsers} />
						{languageService.translate("User.Team")}
					</Link>
				</div>
			);
		}
		else {
			return (
				<div className="grid gaps">
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/calendar"}>
						<FontAwesomeIcon className="margin-right-8" icon={faCalendarAlt} />
						{languageService.translate("User.Calendar")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/objectives"}>
						<FontAwesomeIcon className="margin-right-8" icon={faTasks} />
						{languageService.translate("User.Objectives")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/topics"}>
						<FontAwesomeIcon className="margin-right-8" icon={faClipboardCheck} />
						{languageService.translate("User.LearnedTopics")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/team"}>
						<FontAwesomeIcon className="margin-right-8" icon={faUsers} />
						{languageService.translate("User.Team")}
					</Link>

					{this.state.user.id === auth.user.id ?
						<Link className="button align-left" to={"/user/me/wholearnedtopicteammembers"}>
							<FontAwesomeIcon className="margin-right-8" icon={faUsers} />
							{languageService.translate("User.6Analysis")}
						</Link> : ""}
					
					<Link className="button align-left" to={"/user/" + this.state.user.id + "/learningpath"}>
						<FontAwesomeIcon className="margin-right-8" icon={faProjectDiagram} />
						{languageService.translate("User.Path")}
					</Link>
					
				</div>
			);
		}
	}

	renderChangeLearningDayLimitButton() {
		if (this.canChangeLearningDayLimit()) {
			//if not admin, admin cannot remove learning day limit
			if (this.state.user.superVisorId) {
				return (
					<>
						<Link className="unbold margin-right-32 margin-top-8" to={"/user/" + this.state.user.id + "/changelearningdaylimit"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPen} />
							{languageService.translate("Edit")}
						</Link>
						<Link className="unbold margin-right-32 margin-top-8" onClick={this.handleRemoveLearningDayLimitClicked}>
							<FontAwesomeIcon className="margin-right-4" icon={faWindowClose} />
							{languageService.translate("Remove")}
						</Link>
					</>
				);
			} else {
				return (
					<>
						<Link className="unbold margin-right-32 margin-top-8" to={"/user/" + this.state.user.id + "/changelearningdaylimit"}>
							<FontAwesomeIcon className="margin-right-4" icon={faPen} />
							{languageService.translate("Edit")}
						</Link>
					</>
				);
			}
		} else {
			return "";
		}
	}
	
	renderAttributes() {
		
		if (this.state.user === null) {
			return "";
		}
		
		if (!this.state.user.superVisorId && this.state.user.isSuperVisor) {
			return (
				<>
					<span className="badge">{languageService.translate("User.AdminBadge")}</span>
					<span className="badge">{languageService.translate("User.SuperVisorBadge")}</span>
				</>
			);
		} else if (!this.state.user.superVisorId) {
			return <span className="badge">{languageService.translate("User.AdminBadge")}</span>;
		} else if (this.state.user.isSuperVisor) {
			return <span className="badge">{languageService.translate("User.SuperVisorBadge")}</span>;
		} else {
			return <span className="badge">{languageService.translate("User.WorkerBadge")}</span>;
		}
	}
	
	renderInfo() {
		
		if (this.state.user === null) {
			return (
				<>
					<div className="margin-top-16">
						<strong>{languageService.translate("User.EmailAddress")}: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
					<div>
						<strong>{languageService.translate("User.RegistrationDate")}: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
					<div>
						<strong>{languageService.translate("User.LearningDayLimit")}: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
					<div>
						<strong>{languageService.translate("User.SendLearningDayAsEvent")}: </strong> <span className="inline-block"><Loading width={16} height={16} type={"spin"} /></span>
					</div>
				</>
			);
		}
		else {
			return (
				<>
					<div className="margin-top-16">
						<strong>{languageService.translate("User.EmailAddress")}: </strong> {this.state.user.username}
					</div>
					<div>
						<strong>{languageService.translate("User.RegistrationDate")}: </strong> {moment.utc(this.state.user.creationDate).local().format('YYYY-MM-DD hh:mm')}
					</div>
					<div>
						<strong>{languageService.translate("User.LearningDayLimit")}: </strong> {this.state.user.learningDayLimitPerQuarter} {this.renderChangeLearningDayLimitButton()}
					</div>
					<div>
						<strong>{languageService.translate("User.SendLearningDayAsEvent")}: </strong> {this.state.user.sendLearningDaysByEmail ? languageService.translate("True") : languageService.translate("False")}
					</div>
				</>
			);
		}
	}

	renderActionButtons() {
		if (this.state.user === null) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else {
			if (this.state.enableDisableButtonEnabled) {
				return (
					this.canDisableEnableUser() ?
						(this.state.user.isDisabled ?
							<button className="primary" onClick={this.handleEnableClicked}>
								{languageService.translate("User.Enable")}
							</button> :
							<button className="primary" onClick={this.handleDisableClicked}>
								{languageService.translate("User.Disable")}
							</button>)
						: ""
				);
			} else {
				return <Loading width={50} height={50} type={"balls"} />;
			}
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
									{languageService.translate("User.Loading")}
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
							{languageService.translate("User.MoreInformation")}:
						</h2>
						
						<div className="flex-spacer" />
						
						{this.canEditUserInfo() ?
							<Link className="unbold margin-right-32 margin-top-8" to={"/user/" + this.state.user.id + "/edit"}>
								<FontAwesomeIcon className="margin-right-4" icon={faPen} />
								{languageService.translate("Edit")}
							</Link> :
							""
						}
					</div>
					
					{this.renderInfo()}
					
					{
						this.canChangePassword() ?
							<Link className="button border margin-top-32" to={"/user/me/changepassword"}>
								<FontAwesomeIcon className="margin-right-8" icon={faUnlockAlt} />
								{languageService.translate("User.ChangePassword")}
							</Link>:
							""
					}

					{this.renderActionButtons()}
				</div>
			</Layout>
		);
	}

	handleDisableClicked() {

		this.setState({
			enableDisableButtonEnabled: false
		});

		userService.disableUser(this.state.user.id)
			.then((data) => {
				if (data.isSuccess) {
					this.getData();
					this.notifRef.current.addNotification({ text: languageService.translate("User.DisableSuccessMessage"), isSuccess: true });
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					enableDisableButtonEnabled: true
				});
			});
	}

	handleEnableClicked() {
		this.setState({
			enableDisableButtonEnabled: false
		});

		userService.enableUser(this.state.user.id)
			.then((data) => {
				if (data.isSuccess) {
					this.getData();
					this.notifRef.current.addNotification({ text: languageService.translate("User.EnableSuccessMessage"), isSuccess: true });
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					enableDisableButtonEnabled: true
				});
			});
	}

	handleRemoveLearningDayLimitClicked(event) {
		let userToUpdate = this.state.user;

		userToUpdate.learningDayLimitPerQuarter = 0;

		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("ChangeLearningDayLimit.RemoveSuccessMessage"), isSuccess: true });
					this.getData()
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isChangeButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default User;