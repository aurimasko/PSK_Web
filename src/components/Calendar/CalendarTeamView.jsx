import React from 'react';
import Layout from "../Layout";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-with-locales-es6'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../../react-big-calendar-custom-style.css";
import { teamService } from "../../services/teamService.js";
import { auth } from "../../services/auth.js";
import Loading from "../Loading";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'

import EmptySidebar from "./EmptySidebar";
import DayContentSidebar from "./DayContentSidebar";
import UserListSidebar from "./UserListSidebar";


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


class CalendarTeamView extends React.Component {
	
	constructor(props) {
		super(props);
		
		const today = new Date();
		today.setHours(0,0,0,0);
		
		this.state = {
			day: today,
			team: null,
			filteredTeammates: [],
			events: null,
			learningDays: null,
			startDate: moment(today).startOf('month').subtract(7, 'days'),
			endDate: moment(today).endOf('month').add(7, 'days'),		
			sidebarSelectedUser: null,
			currentLearningDayId: null,
			currentLearningDaysUserIds: null
		};
		
		this.handleSelectUser = this.handleSelectUser.bind(this);
		this.handleUserClose = this.handleUserClose.bind(this);
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);
		this.handleToggleEveryone = this.handleToggleEveryone.bind(this);

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
		const result = await teamService.fetchLearningDaysByLeaderId(id, startDate, endDate);
		if (result.isSuccess === true) {
			let currentLearningDay = result.content.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(this.state.day).format("YYYY-MM-DD"));
			let currentLearningDaysUserIds = currentLearningDay.map((ld) => { return ld.employeeId; });
			this.setState({
				team: result.content,
				learningDays: result.content.learningDays,
				events: result.content.learningDays.map(function (value) { return value.date }),
				currentLearningDayId: currentLearningDay.length > 0 ? currentLearningDay[0].id : null,
				currentLearningDaysUserIds: currentLearningDaysUserIds
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
					<Loading showText={true}/>
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>

					<div className="calendar-layout">
						
						<div className="cal-side-panel flex-down">
							<h1 className="center unbold">
								Team members:
							</h1>
							{this.renderTeamFilerList()}
							
							<div className="flex-spacer" />
							
							<button className="primary" onClick={this.handleToggleEveryone}>Toggle everyone</button>
						</div>
						
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
	
	renderTeamFilerList() {
		// this should just be this.state.team.members but it's always null atm
		
		let teammates = [
			{
				id: "1",
				firstName: "Vardenis",
				lastName: "Pavardenis"
			}
		];
		
		return teammates.map((tm) => this.renderTeamFilerListItem(tm));
	}
	
	renderTeamFilerListItem(teammate) {
		return (
			<button className="flex-right align-left" onClick={() => this.handleToggleTeammate(teammate.id)}>
				<span className="margin-left-8 text-primary">
					
					{ ( !Array.isArray(this.state.filteredTeammates) || this.state.filteredTeammates.includes(teammate.id) ) ? 
						<FontAwesomeIcon icon={faSquare} />:
						<FontAwesomeIcon icon={faCheckSquare} />
					}
				</span>
				
				<span className="margin-left-8">{teammate.firstName} {teammate.lastName}</span>
			</button>
		);
	}
	
	renderSidebarContent() {
		
		if (this.state.sidebarSelectedUser !== null) {
			return (
				<DayContentSidebar date={this.state.day} user={this.state.sidebarSelectedUser} handleUserClose={this.handleUserClose} currentLearningDayId={this.state.currentLearningDayId} notifRef={this.notifRef} isTeam={false}/>
			);
		}
		else if (this.dateNotEmpty(this.state.day)) {
			return <UserListSidebar date={this.state.day} currentLearningDayUserIds={this.state.currentLearningDaysUserIds} notifRef={this.notifRef} handleSelectUser={this.handleSelectUser} />;
		}
		else {
			return <EmptySidebar />;
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
	
	handleToggleTeammate(id, isFiltered) {
		
		if (isFiltered !== true && isFiltered !== true) {
			// isFiltered is not bool, so just toggle whatever value is in the state
			isFiltered = !this.state.filteredTeammates.includes(id);
		}
		
		if (isFiltered === true) {
			const newFilteredList = this.state.filteredTeammates.concat(id);
			this.setState({filteredTeammates: newFilteredList});
		}
		else {
			const newFilteredList = this.state.filteredTeammates.filter((tm) => tm !== id);
			this.setState({filteredTeammates: newFilteredList});
		}
	}
	
	handleToggleEveryone() {
		if (this.state.filteredTeammates.length > 0) {
			this.setState({filteredTeammates: []});
		}
		else {
			alert("will work when this.state.team.members won't be always null");
		}
	}
	
	handleSelectUser(user) {
		let currentLearningDay = this.state.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(this.state.day).format("YYYY-MM-DD") &&
			d.employeeId === user.id);
		this.setState({ sidebarSelectedUser: user, currentLearningDayId: currentLearningDay.length > 0 ? currentLearningDay[0].id : null});
	}
	
	handleUserClose() {
		this.setState({ sidebarSelectedUser: null, currentLearningDayId: null });
	}
	
	handleDaySelect(slotInfo) {
		let currentLearningDay = this.state.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(slotInfo.start).format("YYYY-MM-DD"));
		let currentLearningDaysUserIds = currentLearningDay.map((ld) => { return ld.employeeId; });
		this.setState({ day: slotInfo.start, sidebarSelectedUser: null, currentLearningDaysUserIds: currentLearningDaysUserIds});
	}

	handleDateRangeChange(range) {
		this.setState({
			startDate: range.start,
			endDate: range.end
		});
		this.getData(range.start, range.end);
	}
}

export default CalendarTeamView;