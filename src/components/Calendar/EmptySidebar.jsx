import React from 'react';
import { languageService } from "../../services/languageService.js";

class DayContentSidebar extends React.Component {
	
	render() {
		return (
			<>
				<div className="flex-spacer" />
				
				<span className="center margin-left-16 margin-right-16">
					{languageService.translate("UserCalendar.NoRegisteredLearningDaysMessage")}
				</span>
				
				<div className="flex-spacer" />
			</>
		);
	}
	
	
}

export default DayContentSidebar;