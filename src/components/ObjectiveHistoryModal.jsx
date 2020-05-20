import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../services/languageService.js";
import Loading from "./Loading";

class ObjectivesHistoryModal extends React.Component {
	
	render() {
		return (
			<div className={this.props.isEnabled ? "modal-container show flex-down" : "modal-container flex-down"}>
				<div className="flex-spacer" />
				
				<div className="container wide m">
					
					<div className="flex-right">
						
						<h1>
							{languageService.translate("ObjectiveChangeHistory.Title")}
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
		if (this.props.historyList === null) {
			return <Loading showText={true} />;
		} else {
			return this.props.historyList.map((histItem, index) => this.renderHistoryListItem(histItem, index));
		}
	}
	
	renderHistoryListItem(histItem, index) {
		return (
			<div key={index}>
				<hr />
				
				<div>
					<span className="bold">{languageService.translate("ObjectiveChangeHistory.Date")}: </span>
					{moment.utc(histItem.creationDate).local().format('YYYY-MM-DD hh:mm')}
				</div>
				<div>
					<span className="bold">{languageService.translate("ObjectiveChangeHistory.User")}: </span>
					{histItem.creator.firstName} {histItem.creator.lastName}
				</div>
				<div>
					<div>
						<span className="bold">{languageService.translate("ObjectiveChangeHistory.OldStatus")}: </span>
						{histItem.oldState}
					</div>
				</div>
				<div>
					<div>
						<span className="bold">{languageService.translate("ObjectiveChangeHistory.NewStatus")}: </span>
						{histItem.newState}
					</div>
				</div>
			</div>
		);
	}
}

export default ObjectivesHistoryModal;