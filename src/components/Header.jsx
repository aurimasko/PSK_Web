import React from 'react';
import "../global.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars, faTimes, faCalendarAlt, faUser, faTags, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { auth } from "../services/auth.js";


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
			
			hamburgerActive: false
		}
		
		this.handleBackButton = this.handleBackButton.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleUseOther = this.handleUseOther.bind(this);
		this.handleUseLogout = this.handleUseLogout.bind(this);
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
					<FontAwesomeIcon icon={faCalendarAlt} /> My calendar
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
					<FontAwesomeIcon icon={faClipboardList} /> Topics
				</Link>
				
				<Link
					className={
						this.state.hamburgerActive ?
							"button primary collapse uncollapse" :
							"button primary collapse"
					}
					to={"/roles"}
					onClick={this.handleUseOther}
				>
					<FontAwesomeIcon icon={faTags} /> Roles	
				</Link>
				
				
				<Link
					className={
						this.state.hamburgerActive ?
							"button danger collapse uncollapse" :
							"button danger collapse"
					}
					to="/login"
					onClick={this.handleUseLogout}
				>
					<FontAwesomeIcon icon={faSignOutAlt} /> Logout
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
					<FontAwesomeIcon icon={faArrowLeft} /> Back
				</button>
			);
		}
		else {
			return "";
		}
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