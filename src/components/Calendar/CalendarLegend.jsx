import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../../services/languageService.js";

class CalendarLegend extends React.Component {
	
	render() {
		return (
			<div className="cal-main-panel">
				
				<h3 className="margin-bottom-16">Legend</h3>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static">01</div>
					Empty day
				</div>
			
				<div>
					<div className="cal-legend-box rbc-day-bg-static rbc-today-static">01</div>
					Current date
				</div>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static rbc-off-range-bg-static">01</div>
					Day of another month
				</div>
			
				<div>
					<div className="cal-legend-box rbc-day-bg-static selected-static">01</div>
					Selected day
				</div>
				
				<div>
					<div className="cal-legend-box rbc-day-bg-static not-empty-static">01</div>
					Day with event
				</div>
				
			</div>
		);
	}
}

export default CalendarLegend;