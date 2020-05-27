import React from 'react';
import Layout from "../Layout";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-with-locales-es6'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../../react-big-calendar-custom-style.css";
import { learningDayService } from "../../services/learningDayService.js";
import { auth } from "../../services/auth.js";
import Loading from "../Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

import EmptySidebar from "./EmptySidebar";
import DayContentSidebar from "./DayContentSidebar";
import CreateFormSidebar from "./CreateFormSidebar";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";

moment.locale(languageService.getLanguage());
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
			currentLearningDay: null,
			isCurrentUser: false
		};
		
		this.handleEnterEditMode = this.handleEnterEditMode.bind(this);
		this.handleExitEditMode = this.handleExitEditMode.bind(this);
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);

		this.notifRef = React.createRef();
	}
	
	
	async componentDidMount() {
		await this.getData(this.state.startDate, this.state.endDate);

		//call manually, to handle current date
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		this.handleDaySelect({ start: today });
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

			this.setState({
				learningDays: result.content,
				events: result.content.map(function (value) { return value.date })
			});
			this.initUI();
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	initUI() {
		var calendarButtonsParents = document.getElementsByClassName("rbc-btn-group");
		if (!calendarButtonsParents) {
			return;
		}

		var calendarButtonParent = calendarButtonsParents[0];
		if (!calendarButtonParent) {
			return;
		}

		var calendarButtons = calendarButtonParent.childNodes;
		if (calendarButtons.length === 0) {
			return;
		}

		calendarButtons[0].innerHTML = languageService.translate("UserCalendar.Today");
		calendarButtons[1].innerHTML = languageService.translate("UserCalendar.Back");
		calendarButtons[2].innerHTML = languageService.translate("UserCalendar.Next");
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

							{this.props.match.params.id !== "me" && this.props.match.params.id !== auth.user.id ?
								<Link className="margin-bottom-16" to={"/user/" + this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id}>
									<FontAwesomeIcon className="margin-right-8" icon={faAngleLeft} />
									{languageService.translate("UserCalendar.GoToUsersPage")}
								</Link> : ""
							}
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

		//creating
		if (!this.dateNotEmpty(this.state.day) && this.state.isCreating) {
			return (
				<>
					<CreateFormSidebar handleExitEditMode={this.handleExitEditMode} notifRef={this.notifRef} date={this.state.day}/>
				</>
			);
		}

		//editing
		if (this.dateNotEmpty(this.state.day) && this.state.isCreating) {
			if (this.state.currentLearningDay === null) {
				return <Loading />;
			} else {
				return (
					<>
						<CreateFormSidebar handleExitEditMode={this.handleExitEditMode} notifRef={this.notifRef} date={this.state.day} isEditing={true} learningDayId={this.state.currentLearningDay.id} />
					</>
				);
			}
		}

		if (this.dateNotEmpty(this.state.day)) {
			if (this.state.currentLearningDay === null) {
				return <Loading />;
			}else {
				//normalize dates
				let selectedDate = this.state.day;
				let selectedDateDate = new Date(Date.parse(selectedDate));
				selectedDateDate.setHours(0, 0, 0, 0);

				let currentDate = new Date();
				let currentDateDate = new Date(Date.parse(currentDate));
				currentDateDate.setHours(0, 0, 0, 0);

				//check if current day or future day, otherwise don't allow to edit
				//same day is still allowed, so compare only year-month-day
				if (this.state.isCurrentUser && selectedDateDate >= currentDateDate) {
					return (
						<>
							<DayContentSidebar date={this.state.day} notifRef={this.notifRef} currentLearningDayId={this.state.currentLearningDay.id} />
							<button className="primary margin-top-24" onClick={this.handleEnterEditMode}>{languageService.translate("Edit")}</button>
						</>
					);

				} else {
					return (
						<>
							<DayContentSidebar date={this.state.day} notifRef={this.notifRef} currentLearningDayId={this.state.currentLearningDay.id} />
						</>
					);
				}
			}
		}
		else {
			if (this.state.isCurrentUser) {
				return (
					<>
						<EmptySidebar />
						<button className="primary margin-top-24" onClick={this.handleEnterEditMode}>{languageService.translate("Create")}</button>
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

		if (this.state.currentLearningDay) {
			let currentLearningDayDate = new Date(Date.parse(this.state.currentLearningDay.date));
			currentLearningDayDate.setHours(0, 0, 0, 0);

			let dateDate = new Date(Date.parse(date));
			dateDate.setHours(0, 0, 0, 0);

			if (currentLearningDayDate.getTime() === dateDate.getTime()) {
				return true;
			}
		}

		for (const eventDay of this.state.events) {
			
			let eventDateObj = new Date(Date.parse(eventDay));
			eventDateObj.setHours(0,0,0,0);
			
			if (date.getTime() === eventDateObj.getTime()) {
				return true;
			}
		}
		
		return false;
	}
	
	handleEnterEditMode() {
		this.setState({ isCreating: true });
	}
	
	handleExitEditMode() {
		this.setState({ isCreating: false });
		this.getData(this.state.startDate, this.state.endDate);
	}
	
	handleDaySelect(slotInfo) {
		let currentLearningDay = this.state.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(slotInfo.start).format("YYYY-MM-DD"));
		this.setState({ day: slotInfo.start, isCreating: false, currentLearningDay: currentLearningDay[0] });
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