import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


class ObjectivesHistoryModal extends React.Component {
	
	render() {
		return (
			<div className={this.props.isEnabled ? "modal-container show flex-down" : "modal-container flex-down"}>
				<div className="flex-spacer" />
				
				<div className="container wide m">
					
					<div className="flex-right">
						
						<h1>
							Topic <Link className="bold" to={"/topic/" + 1}>
								{ this.props.selectedObjective !== null ?
									this.props.selectedObjective.name :
									""
								}
							</Link> history
						</h1>
						
						<div className="flex-spacer" />
						
						<button onClick={this.props.handleClose}>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
					
					{this.renderHistoryList()}
				</div>
				
				<div className="flex-spacer" />
			</div>
		);
	}
	
	renderHistoryList() {
		return this.props.historyList.map( (histItem, index) => this.renderHistoryListItem(histItem, index));
	}
	
	renderHistoryListItem(histItem, index) {
		return (
			<div key={index}>
				<hr />
				
				<div>
					<span className="bold">Date of the change: </span>
					{histItem.date}
				</div>
				<div>
					<span className="bold">User who chaged status: </span>
					{histItem.user.firstName} {histItem.user.lastName}
				</div>
				<div>
					<div>
						<span className="bold">Old status: </span>
						{histItem.oldState}
					</div>
				</div>
				<div>
					<div>
						<span className="bold">New status: </span>
						{histItem.newState}
					</div>
				</div>
			</div>
		);
	}
}

export default ObjectivesHistoryModal;