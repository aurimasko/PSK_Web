import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../services/languageService.js";
import Loading from "./Loading";


class ConcurrencyErrorModal extends React.Component {
	
	render() {
		return (
			<div className={this.props.isEnabled ? "modal-container show flex-down" : "modal-container flex-down"}>
				<div className="flex-spacer" />
				
				<div className="container wide m">
					
					<h1>
						<span className="margin-right-8">
							<FontAwesomeIcon  icon={faExclamationTriangle} />
						</span>
						
						
						{languageService.translate("ConcurrencyErrorModal.Title")}
					</h1>
					
					<p className="margin-top-16">
						{languageService.translate("ConcurrencyErrorModal.Explanation")}
					</p>
					
					<button className="button border margin-bottom-8 margin-top-16" onClick={this.props.handleOverwrite}>
						{languageService.translate("ConcurrencyErrorModal.Overwrite")}
					</button>
					
					<button className="button border margin-vertical-8" onClick={this.props.handleUpdateFields}>
						{languageService.translate("ConcurrencyErrorModal.UpdateFields")}
					</button>
					
					<button className="button border margin-top-8" onClick={this.props.handleCompareChanges}>
						{languageService.translate("ConcurrencyErrorModal.CompareChanges")}
					</button>
				</div>
				
				<div className="flex-spacer" />
			</div>
		);
	}
}

export default ConcurrencyErrorModal;