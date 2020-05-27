import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../../services/languageService.js";

class CalendarLegend extends React.Component {
	
	render() {
		return (
			<div className="cal-main-panel">
				
				<h3 className="margin-bottom-16">{languageService.translate("CalendarLegend.Title")}</h3>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static">01</div>
					{languageService.translate("CalendarLegend.Empty")}
				</div>
			
				<div>
					<div className="cal-legend-box rbc-day-bg-static rbc-today-static">01</div>
					{languageService.translate("CalendarLegend.Current")}
				</div>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static rbc-off-range-bg-static">01</div>
					{languageService.translate("CalendarLegend.OffRange")}
				</div>
			
				<div>
					<div className="cal-legend-box rbc-day-bg-static selected-static">01</div>
					{languageService.translate("CalendarLegend.Selected")}
				</div>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static not-empty-static">01</div>
					{languageService.translate("CalendarLegend.Event")}
				</div>
				
			</div>
		);
	}
}

export default CalendarLegend;