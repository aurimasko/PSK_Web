import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { userService } from "../../services/userService.js";
import Loading from "../Loading";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { sortHelpers } from "../../helpers/sortHelpers.js";

class UserListSidebar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			users: null,
			currentLearningDayUserIds: props.currentLearningDayUserIds,
			usersList: null
		};

		this.notifRef = props.notifRef;
	}

	async componentDidMount() {
		this.getData(this.state.currentLearningDayUserIds);
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.currentLearningDayUserIds !== this.props.currentLearningDayUserIds) {
			this.setState({
				users: null,
				currentLearningDayUserIds: this.props.currentLearningDayUserIds,
				usersList: null
			});

			this.getData(this.props.currentLearningDayUserIds);
		}
	}

	async getData(learningDayUserIds) {
		const result = await userService.fetchUsersByIds(learningDayUserIds);
		if (result.isSuccess === true) {
			let users = result.content;

			let sortedUsers = sortHelpers.sortUsersByFirstNameAndLastName(users);

			this.setState({
				users: sortedUsers,
				usersList: sortedUsers.map((user) =>
					<li key={user.id}>
						<a href="#" onClick={(e) => { this.props.handleSelectUser(user.id); e.preventDefault(); }}>
							<FontAwesomeIcon icon={faUser} listItem />
							{user.firstName} {user.lastName} ({user.username})
						</a>
					</li>
				)
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	render() {
		if (this.state.usersList === null) {
			return <Loading showText={true} />;
		} else {
			return (
				<>

					<div>
						<h3 className="margin-top-24">Teammates:</h3>
						<ul className="fa-ul">
							{this.state.usersList}
						</ul>
					</div>

					<div className="flex-spacer" />
				</>
			);
		}
	}
	
	
}

export default UserListSidebar;