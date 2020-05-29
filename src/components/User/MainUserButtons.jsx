import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlockAlt, faPen, faUser, faCalendarAlt, faUsers, faTasks, faClipboardCheck, faRemoveFormat, faCross, faWindowClose, faProjectDiagram,faColumns } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../../services/auth.js";
import { roleService } from "../../services/roleService.js";
import { userService } from "../../services/userService.js";
import moment from 'moment';
import Loading from "../../components/Loading";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";


class MainUserButtons extends React.Component {
	
	render() {
		if (this.props.user === null) {
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
					<Link className="button align-left" to={"/user/" + this.props.user.id + "/calendar"}>
						<FontAwesomeIcon className="margin-right-8" icon={faCalendarAlt} />
						{languageService.translate("User.Calendar")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.props.user.id + "/objectives"}>
						<FontAwesomeIcon className="margin-right-8" icon={faTasks} />
						{languageService.translate("User.Objectives")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.props.user.id + "/team"}>
						<FontAwesomeIcon className="margin-right-8" icon={faUsers} />
						{languageService.translate("User.Team")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.props.user.id + "/learningpath"}>
						<FontAwesomeIcon className="margin-right-8" icon={faProjectDiagram} />
						{languageService.translate("User.Path")}
					</Link>
					
					<Link className="button align-left" to={"/user/" + this.props.user.id + "/learningplan"}>
						<FontAwesomeIcon className="margin-right-8" icon={faColumns} />
						{languageService.translate("User.LearningPlan")}
					</Link>
					
				</div>
			);
		}
	}
	
}

export default MainUserButtons;