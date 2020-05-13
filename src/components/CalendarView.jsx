import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-with-locales-es6'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../react-big-calendar-custom-style.css";
import { learningDayService } from "../services/learningDayService.js";
import { auth } from "../services/auth.js";
import Loading from "../components/Loading";

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


class CalendarView extends React.Component {
	
	constructor(props) {
		super(props);
		
		const today = new Date();
		today.setHours(0,0,0,0);
		
		this.state = {
			day: today,
			events: null,
			learningDays: null
		};
		
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.setDayStyle = this.setDayStyle.bind(this);
	}
	
	
	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getData();
		}
	}

	async getData() {
		var id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		//TODO: add parameters start and end date
		var result = await learningDayService.fetchLearningDaysByUserIdWithPeriod(id);
		if (result.isSuccess === true) {
			this.setState({
				learningDays: result.content,
				events: result.content.map(function (value) { return value.Date })
			});
			this.initUI();
		} else {
			console.log(JSON.stringify(result));
		}
	}

	initUI() {
		var calendarButtons = document.getElementsByClassName("rbc-btn-group")[0].childNodes;

		calendarButtons[0].innerHTML = "Today";
		calendarButtons[1].innerHTML = "<";
		calendarButtons[2].innerHTML = ">";
    }
	
	
	render() {
		if (this.state.events == null) {
			return (
				<Layout>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout>

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
								onSelectSlot={(slotInfo) => this.handleDaySelect(slotInfo)}
							/>

						</div>

						<div className="flex-spacer" />

						<div className="cal-side-panel flex-down">
							<h1 className="center unbold">
								{formatDate(this.state.day)}
							</h1>

							<h3>Mokymosi dienos temos:</h3>

							<ul className="fa-ul margin-top-16 scroll">
								<li className="margin-top-8 margin-right-24">
									<Link className="bold" to="/topic/1">
										<FontAwesomeIcon icon={faGraduationCap} listItem />
									React.js portals
								</Link>
									<p>
										Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
								</p>
								</li>

								<li className="margin-top-8 margin-right-24">
									<Link className="bold" to="/topic/2"><FontAwesomeIcon icon={faGraduationCap} listItem />Docker</Link>
									<p>
										Docker is a set of platform as a service (PaaS) products that uses OS-level virtualization to deliver software in packages called containers.
								</p>
								</li>

								<li className="margin-top-8 margin-right-24">
									<Link className="bold" to="/topic/3"><FontAwesomeIcon icon={faGraduationCap} listItem />CSS grid</Link>
									<p>
										CSS grid layout or CSS grid is a technique in Cascading Style Sheets that allows web developers to create complex responsive web design layouts more easily and consistently across browsers.
								</p>
								</li>
							</ul>

							<h3 className="margin-top-16">Mokymosi dienos komentaras:</h3>

							<p className="">
								<i>no comments</i>
							</p>


							<div className="flex-spacer" />
							<button className="primary margin-top-24">Keisti</button>

						</div>

					</div>
				</Layout>
			);
		}
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