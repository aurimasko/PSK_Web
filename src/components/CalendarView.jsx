import React from 'react';
import Layout from "./Layout";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-with-locales-es6'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../react-big-calendar-custom-style.css";


moment.locale('lt');
const localizer = momentLocalizer(moment);


class CalendarView extends React.Component {
	
	constructor(props) {
		super(props);
		
		const inTwoDays = new Date();
		inTwoDays.setDate(inTwoDays.getDate() + 2);
		inTwoDays.setHours(0,0,0,0);
		
		this.state = {
			day: inTwoDays,
			events: [
				"2020-04-10",
				"2020-04-20",
				"2020-05-01",
				"2020-05-18",
			]
		};
		
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);
	}
	
	
	componentDidMount() {
		var calendarButtons = document.getElementsByClassName("rbc-btn-group")[0].childNodes;
		
		calendarButtons[0].innerHTML = "Rodyti šią dieną";
		calendarButtons[1].innerHTML = "<";
		calendarButtons[2].innerHTML = ">";
	}
	
	
	render() {
		return (
			<Layout>
				
				<div className="flex-right">
					
					<div className="container flex-spacer">
						
						<Calendar
							localizer={localizer}
							views={{ month: true }}
							events={[]}
							style={{ height: 500 }}
							
							dayPropGetter={(date) => this.setDayStyle(date)}
							
							selectable='ignoreEvents'
							onSelectSlot={(slotInfo) => this.handleDaySelect(slotInfo)}
						/>
						
					</div>
					
				</div>
				
			</Layout>
		);
	}
	
	
	setDayStyle(date) {
		
		let classes = "";
		
		if (date.getTime() === this.state.day.getTime()) {
			classes = classes + "selected ";
		}
		
		this.state.events.forEach((eventDate) => {
			
			let eventDateObj = new Date(Date.parse(eventDate))
			eventDateObj.setHours(0,0,0,0);
			
			if (date.getTime() === eventDateObj.getTime()) {
				classes = classes + "not-empty ";
			}
		});
		
		return {className: classes};
	}
	
	
	handleDaySelect(slotInfo) {
		this.setState({day: slotInfo.start});
	}
}

export default CalendarView;