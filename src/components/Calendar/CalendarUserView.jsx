import React from 'react';
import Layout from "../Layout";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-with-locales-es6'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../../react-big-calendar-custom-style.css";
import { learningDayService } from "../../services/learningDayService.js";
import { auth } from "../../services/auth.js";
import Loading from "../Loading";

import EmptySidebar from "./EmptySidebar";
import DayContentSidebar from "./DayContentSidebar";
import CreateFormSidebar from "./CreateFormSidebar";
import { responseHelpers } from "../../helpers/responseHelpers.js";


moment.locale('en');
const localizer = momentLocalizer(moment);


function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) 
		month = '0' + month;
	if (day.length < 2) 
		day = '0' + day;

	return [year, month, day].join('-');
}


class CalendarUserView extends React.Component {
	
	constructor(props) {
		super(props);
		
		const today = new Date();
		today.setHours(0,0,0,0);
		
		this.state = {
			day: today,
			events: null,
			learningDays: null,
			startDate: moment(today).startOf('month').subtract(7, 'days'),
			endDate: moment(today).endOf('month').add(7, 'days'),
			isCreating: false,
			currentLearningDayId: null,
			isCurrentUser: false
		};
		
		this.handleEnterEditMode = this.handleEnterEditMode.bind(this);
		this.handleExitEditMode = this.handleExitEditMode.bind(this);
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);

		this.notifRef = React.createRef();
	}
	
	
	async componentDidMount() {
		this.getData(this.state.startDate, this.state.endDate);
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getData(this.state.startDate, this.state.endDate);
		}
	}

	async getData(startDate, endDate) {
		const id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		this.setState({
			isCurrentUser: id === auth.user.id
		});
		const result = await learningDayService.fetchLearningDaysByUserIdWithPeriod(id, startDate, endDate);
		if (result.isSuccess === true) {

			let currentLearningDay = result.content.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(this.state.day).format("YYYY-MM-DD"));
			this.setState({
				learningDays: result.content,
				events: result.content.map(function (value) { return value.date }),
				currentLearningDayId: currentLearningDay.length > 0 ? currentLearningDay[0].id : null
			});
			//this.initUI();
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	initUI() {
		var calendarButtons = document.getElementsByClassName("rbc-btn-group")[0].childNodes;

		calendarButtons[0].innerHTML = "Today";
		calendarButtons[1].innerHTML = "<";
		calendarButtons[2].innerHTML = ">";
	}
	
	
	render() {
		if (this.state.events === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>

					<div className="calendar-layout">

						<div className="flex-spacer" />

						<div className="cal-main-panel">

							<Calendar
								localizer={localizer}
								views={{ month: true }}
								events={[]}
								style={{ height: 500 }}

								dayPropGetter={(date) => this.setDayStyle(date)}

								selectable='ignoreEvents'
								//selectable='true'
								onSelectSlot={(slotInfo) => this.handleDaySelect(slotInfo)}
								onRangeChange={(range) => this.handleDateRangeChange(range)}
							/>
							
						</div>
						
						<div className="flex-spacer" />
						
						<div className="cal-side-panel flex-down">
							<h1 className="center unbold">
								{formatDate(this.state.day)}
							</h1>
							
							{this.renderSidebarContent()}
						</div>
						
					</div>
				</Layout>
			);
		}
	}
	
	renderSidebarContent() {
		
		if (this.state.isCreating) {
			return (
				<>
					<CreateFormSidebar handleExitEditMode={this.handleExitEditMode} notifRef={this.notifRef} date={this.state.day}/>
				</>
			);
		}
		if (this.dateNotEmpty(this.state.day)) {
			if (this.state.isCurrentUser) {
				return (
					<>
						<DayContentSidebar date={this.state.day} notifRef={this.notifRef} currentLearningDayId={this.state.currentLearningDayId} />
						<button className="primary margin-top-24" onClick={this.handleEnterEditMode}>Edit</button>
					</>
				);
			} else {
				return (
					<>
						<DayContentSidebar date={this.state.day} notifRef={this.notifRef} currentLearningDayId={this.state.currentLearningDayId} />
					</>
				);
			}
		}
		else {
			if (this.state.isCurrentUser) {
				return (
					<>
						<EmptySidebar />
						<button className="primary margin-top-24" onClick={this.handleEnterEditMode}>Create</button>
					</>
				);
			} else {
				return (
					<>
						<EmptySidebar />
					</>
				);
			}
		}
		
		
	}
	
	setDayStyle(date) {
		
		let classes = "";
		
		if (date.getTime() === this.state.day.getTime()) {
			classes = classes + "selected ";
		}
		
		if (this.dateNotEmpty(date)) {
			classes = classes + "not-empty ";
		}
		
		return {className: classes};
	}
	
	dateNotEmpty(date) {
		
		for (const eventDay of this.state.events) {
			
			let eventDateObj = new Date(Date.parse(eventDay))
			eventDateObj.setHours(0,0,0,0);
			
			if (date.getTime() === eventDateObj.getTime()) {
				return true;
			}
		}
		
		return false;
	}
	
	handleEnterEditMode() {
		this.setState({isCreating: true});
	}
	
	handleExitEditMode() {
		this.setState({ isCreating: false });
		this.getData(this.state.startDate, this.state.endDate);
	}
	
	handleDaySelect(slotInfo) {
		let currentLearningDay = this.state.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(slotInfo.start).format("YYYY-MM-DD"));
		this.setState({ day: slotInfo.start, isCreating: false, currentLearningDayId: currentLearningDay.length > 0 ? currentLearningDay[0].id : null });
	}

	handleDateRangeChange(range) {
		this.setState({
			startDate: range.start,
			endDate: range.end
		});
		this.getData(range.start, range.end);
	}
}

export default CalendarUserView;