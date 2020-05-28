import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import "../global.css";


class Notifications extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			notifications: [],
			type: "regular"
		};
	}
	
	renderNotifications() {
		
		if (!this.state.notifications && false) {
			return "";
		}
		else {
			const notifications = this.state.notifications.map( (notifText, index) => {
					if (notifText !== null) {
						return (
							<div key={index} className={"flex-right container notification " + this.state.type}>
								<p dangerouslySetInnerHTML={{ __html: notifText}}/>
								<div className="flex-spacer" />
								<button className="notif-btn" onClick={() => {this.closeNotification(index)}}>
									<FontAwesomeIcon icon={faTimes} />
								</button>
							</div>
						);
					}
					else return "";
				}
			);
			
			return (
				<div className="floating-notification">
					{notifications}
				</div>
			);
		}
	}
	
	render() {
		return (
			<div className={this.props.noScroll ? "" : "header-margin"}>
				{this.renderNotifications()}
			</div>
		);
	}
	
	addNotification(obj) {
		let newNotifs = this.state.notifications;
		newNotifs = [];
		newNotifs.push(obj.text);

		if (!obj.isSuccess) {
			this.setState({
				notifications: newNotifs,
				type: "danger"
			});
		} else {
			this.setState({
				notifications: newNotifs,
				type: "success"
			});
		}
	}
	
	closeNotification(index) {
		let newNotifs = this.state.notifications
		newNotifs.splice(index, 1);
		
		this.setState({ notifications: newNotifs});
	}
}

export default Notifications;