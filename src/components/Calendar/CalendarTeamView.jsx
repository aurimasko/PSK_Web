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
import { faSquare, faCheckSquare, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../../services/languageService.js";
import { Link } from "react-router-dom";

import EmptySidebar from "./EmptySidebar";
import DayContentSidebar from "./DayContentSidebar";
import UserListSidebar from "./UserListSidebar";
import CalendarLegend from "./CalendarLegend";

moment.locale(languageService.getLanguage() === "en" ? "en-au" : languageService.getLanguage());
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
			teammates: null,
			events: null,
			learningDays: null,
			filteredLearningDays: null,
			startDate: moment(today).startOf('month').subtract(7, 'days'),
			endDate: moment(today).endOf('month').add(7, 'days'),		
			sidebarSelectedUser: null,
			//currentLearningDayId: null,
			currentLearningDay: null,
			currentLearningDays: null,
			currentLearningDaysUserIds: null,
			filteredCurrentLearningDaysUserIds: null
		};
		
		this.handleSelectUser = this.handleSelectUser.bind(this);
		this.handleUserClose = this.handleUserClose.bind(this);
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);
		this.handleToggleEveryone = this.handleToggleEveryone.bind(this);

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
		const result = await teamService.fetchLearningDaysByLeaderId(id, startDate, endDate);
		if (result.isSuccess === true) {
			let learningDays = result.content.learningDays;
			//let currentLearningDay = learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(this.state.day).format("YYYY-MM-DD"));
			//let currentLearningDaysUserIds = currentLearningDay.map((ld) => { return ld.employeeId; });
			const filteredLearningDays = learningDays.filter((d) => this.state.filteredTeammates.indexOf(d.employeeId) === -1);
			//let filteredCurrentLearningDayUserIds = currentLearningDaysUserIds.filter((u) => this.state.filteredTeammates.indexOf(u) === -1);

			this.setState({
				team: result.content,
				learningDays: learningDays,
				filteredLearningDays: filteredLearningDays,
				events: filteredLearningDays.map(function (value) { return value.date }),
				//currentLearningDayId: currentLearningDay.length > 0 ? currentLearningDay[0].id : null,
				//currentLearningDaysUserIds: currentLearningDaysUserIds,
				//filteredCurrentLearningDaysUserIds: filteredCurrentLearningDayUserIds
			});

			const teamResult = await teamService.fetchTeamByLeaderId(id);
			if (teamResult.isSuccess === true) {
				this.setState({
					teammates: teamResult.content.members
				});
			} else {
				this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(teamResult) });
			}

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

		calendarButtons[0].innerHTML = languageService.translate("TeamCalendar.Today");
		calendarButtons[1].innerHTML = languageService.translate("TeamCalendar.Back");
		calendarButtons[2].innerHTML = languageService.translate("TeamCalendar.Next");
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

					<div className="team-calendar-layout">
						
						<div className="team-cal-side-panel flex-down">
							<h1 className="center unbold">
								{languageService.translate("TeamCalendar.TeamMembers")}:
							</h1>
							{this.renderTeamFilerList()}
							
							<div className="flex-spacer" />
							
							<button className="primary" onClick={this.handleToggleEveryone}>{languageService.translate("TeamCalendar.ToggleEveryone")}</button>
						</div>
						
						
						<div className="cal-main-area">
							
							<div className="flex-spacer" />
							
							<div className="cal-main-panel-width">
								
								<Link className="cal-main-panel block" to={"/user/" + this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id + "/team"}>
									<FontAwesomeIcon className="margin-right-8" icon={faAngleLeft} />
									{languageService.translate("TeamCalendar.GoToTeamPage")}
								</Link>
								
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
								
								<CalendarLegend />
							</div>
							
							<div className="flex-spacer" />
							
						</div>
						

						<div className="team-cal-side-panel flex-down">
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
		if (this.state.teammates === null) {
			return <Loading width={30} height={30} type={"spin"} />;
		} else {
			let teammates = this.state.teammates;
			return teammates.map((tm) => this.renderTeamFilerListItem(tm));
		}
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
				
				<span className="margin-left-8"><a href="#" title={teammate.username}>{teammate.firstName} {teammate.lastName}</a></span>
			</button>
		);
	}
	
	renderSidebarContent() {
		
		if (this.state.sidebarSelectedUser !== null) {
			return (
				<DayContentSidebar date={this.state.day} user={this.state.sidebarSelectedUser} handleUserClose={this.handleUserClose} currentLearningDayId={this.state.currentLearningDay.id} notifRef={this.notifRef} isTeam={false} />
			);
		}
		//else if (this.dateNotEmpty(this.state.day)) {
		else if (this.state.filteredCurrentLearningDaysUserIds && this.state.filteredCurrentLearningDaysUserIds.length > 0) {
			return <UserListSidebar date={this.state.day} currentLearningDayUserIds={this.state.filteredCurrentLearningDaysUserIds} notifRef={this.notifRef} handleSelectUser={this.handleSelectUser} />;
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

		let learningDayDates = this.state.filteredLearningDays.map((d) => {
			let date = d.date;
			let dateDate = new Date(Date.parse(date));
			dateDate.setHours(0, 0, 0, 0);
			return dateDate;
		});

		let dateDate = new Date(Date.parse(date));
		dateDate.setHours(0, 0, 0, 0);

		for (const ld of learningDayDates) {
			if (ld.getTime() === dateDate.getTime())
				return true;
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
			const filteredLearningDays = this.state.learningDays.filter((d) => newFilteredList.indexOf(d.employeeId) === -1);
			const filteredCurrentLearningDaysUserIds = this.state.currentLearningDaysUserIds.filter((u) => newFilteredList.indexOf(u) === -1);

			this.setState({
				filteredTeammates: newFilteredList,
				filteredLearningDays: filteredLearningDays,
				events: filteredLearningDays.map((d) => d.date),
				filteredCurrentLearningDaysUserIds: filteredCurrentLearningDaysUserIds
			});
		}
		else {
			const newFilteredList = this.state.filteredTeammates.filter((tm) => tm !== id);
			const filteredLearningDays = this.state.learningDays.filter((d) => newFilteredList.indexOf(d.employeeId) === -1);
			const filteredCurrentLearningDaysUserIds = this.state.currentLearningDaysUserIds.filter((u) => newFilteredList.indexOf(u) === -1);

			this.setState({
				filteredTeammates: newFilteredList,
				filteredLearningDays: filteredLearningDays,
				events: filteredLearningDays.map((d) => d.date),
				filteredCurrentLearningDaysUserIds: filteredCurrentLearningDaysUserIds
			});
		}
	}
	
	handleToggleEveryone() {
		if (this.state.filteredTeammates.length > 0) {
			this.setState({
				filteredTeammates: [],
				filteredLearningDays: this.state.learningDays,
				events: this.state.learningDays.map((d) => d.date),
				filteredCurrentLearningDaysUserIds: this.state.currentLearningDaysUserIds
			});
		}
		else {
			this.setState({
				filteredTeammates: this.state.teammates.map((m) => m.id),
				filteredLearningDays: [],
				events: [],
				filteredCurrentLearningDaysUserIds: []
			});
		}
	}
	
	handleSelectUser(user) {
		let currentLearningDay = this.state.currentLearningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(this.state.day).format("YYYY-MM-DD") &&
			d.employeeId === user.id);
		this.setState({ sidebarSelectedUser: user, currentLearningDay: currentLearningDay[0]});
	}
	
	handleUserClose() {
		this.setState({ sidebarSelectedUser: null, currentLearningDayId: null });
	}
	
	handleDaySelect(slotInfo) {
		let currentLearningDay = this.state.learningDays.filter(d => moment(d.date).format("YYYY-MM-DD") === moment(slotInfo.start).format("YYYY-MM-DD"));
		let currentLearningDaysUserIds = currentLearningDay.map((ld) => { return ld.employeeId; });
		const filteredCurrentLearningDaysUserIds = currentLearningDaysUserIds.filter((u) => this.state.filteredTeammates.indexOf(u) === -1);

		this.setState({ day: slotInfo.start, sidebarSelectedUser: null, currentLearningDays: currentLearningDay, currentLearningDaysUserIds: currentLearningDaysUserIds, filteredCurrentLearningDaysUserIds: filteredCurrentLearningDaysUserIds });
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