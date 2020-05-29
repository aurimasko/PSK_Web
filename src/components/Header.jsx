import React from 'react';
import "../global.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faClipboardCheck, faArrowLeft, faBars, faTimes, faCalendarAlt, faUser, faTags, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { auth } from "../services/auth.js";
import { languageService } from "../services/languageService.js";


class Header extends React.Component {
	
	static propTypes = {
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	};
	
	constructor(props) {
		super(props);
		
		this.state = {
			user: {
				id: null
			},
			language: languageService.getLanguage(),
			hamburgerActive: false
		}
		
		this.handleBackButton = this.handleBackButton.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleUseOther = this.handleUseOther.bind(this);
		this.handleUseLogout = this.handleUseLogout.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
	}

	renderRolesButton() {
		if (!auth.user.isSuperVisor) {
			return "";
		} else {
			return (
				<Link
					className={
						this.state.hamburgerActive ?
							"button primary collapse uncollapse" :
							"button primary collapse"
					}
					to={"/roles"}
					onClick={this.handleUseOther}
				>
					<FontAwesomeIcon icon={faTags} /> {languageService.translate("Header.Roles")}
				</Link>
			);
		}
	}

	render() {
		return (
			<header className={this.props.noScroll ? "no-scroll" : ""}>
				
				{/*this.renderBackButton()*/}

				<Link
					className="button primary"
					to={"/user/me"}
					onClick={this.handleUseOther}
				>
					<FontAwesomeIcon icon={faUser} /> {auth.user.firstName} {auth.user.lastName}
				</Link>
				
				<div className="flex-spacer"></div>
				
				<button className="primary collapse-menu" onClick={this.handleClick}>
					<FontAwesomeIcon icon={this.state.hamburgerActive ? faTimes : faBars} />
				</button>
				
				<Link
					className={
						this.state.hamburgerActive ?
							"button primary collapse uncollapse" :
							"button primary collapse"
					}
					to={"/user/me/calendar"}
					onClick={this.handleUseOther}
				>
					<FontAwesomeIcon icon={faCalendarAlt} /> {languageService.translate("Header.MyCalendar")}
				</Link>
				
				<Link
						className={
							this.state.hamburgerActive ?
								"button primary collapse uncollapse" :
								"button primary collapse"
						}
						to={"/overview"}
						onClick={this.handleUseOther}
					>
					<FontAwesomeIcon className="margin-right-8" icon={faChartBar} />
					{languageService.translate("Header.Overview")}
				</Link>
				
				<Link
					className={
						this.state.hamburgerActive ?
							"button primary collapse uncollapse" :
							"button primary collapse"
					}
					to={"/topics"}
					onClick={this.handleUseOther}
				>
					<FontAwesomeIcon icon={faClipboardList} /> {languageService.translate("Header.Topics")}
				</Link>

				{this.renderRolesButton()}
				
				{this.renderLanguageSelection()}
				
				<Link
					className={
						this.state.hamburgerActive ?
							"button danger collapse uncollapse" :
							"button danger collapse"
					}
					to="/login"
					onClick={this.handleUseLogout}
				>
					<FontAwesomeIcon icon={faSignOutAlt} /> {languageService.translate("Header.Logout")}
				</Link>
				
				
			</header>
		);
	}
	
	renderBackButton() {
		const { location, history } = this.props;
		
		if(location.pathname !== "/user/me/calendar" && history.length > 1) {
			return (
				<button
					className="button primary"
					to={"/user/me"}
					onClick={this.handleBackButton}
				>
					<FontAwesomeIcon icon={faArrowLeft} /> {languageService.translate("Header.Back")}
				</button>
			);
		}
		else {
			return "";
		}
	}

	renderLanguageSelection() {
		return (
			<select className={
				this.state.hamburgerActive ?
					"button header collapse uncollapse" :
					"button header collapse"
			} value={this.state.language} onChange={this.handleLanguageChange} style={{width: "auto"}}>
				<option key="en" value="en">{languageService.translate("Header.EnglishLanguage")}</option>
				<option key="lt" value="lt">{languageService.translate("Header.LithuanianLanguage")}</option>
			</select>
		);
	}

	handleLanguageChange(event) {
		languageService.setLanguage(event.target.value);
		this.setState({ language: event.target.value });
		event.preventDefault();
		window.location.reload(false);
	}

	handleBackButton() {
		const { history } = this.props;
		this.setState({hamburgerActive: false});
		history.goBack();
	}
	
	handleClick(event) {
		this.setState({hamburgerActive: !this.state.hamburgerActive});
		event.preventDefault();
	}
	
	handleUseOther(event) {
		this.setState({hamburgerActive: false});
	}
	
	handleUseLogout(event) {
		this.setState({hamburgerActive: false});
		auth.logout();
	}
}

const HeaderWithRouter = withRouter(Header);

export default HeaderWithRouter;