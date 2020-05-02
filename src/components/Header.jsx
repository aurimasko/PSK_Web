import React from 'react';
import "../global.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { auth } from "../services/auth.js";


class Header extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			user: {
				id: null
			},
			
			hamburgerActive: false
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.handleUseOther = this.handleUseOther.bind(this);
		this.handleUseLogout = this.handleUseLogout.bind(this);
	}
	
	render() {
		return (
			<header className={this.props.noScroll ? "no-scroll" : ""}>
				<Link className="button primary" to="/home"><FontAwesomeIcon icon={faHome} /> Pradžia</Link>
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
					to="/user/1"
					onClick={this.handleUseOther}
				>
				
					<FontAwesomeIcon icon={faUser} /> Mano paskyra
					
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
					
					<FontAwesomeIcon icon={faSignOutAlt} /> Atsijungti
				
				</Link>
				
				
			</header>
		);
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

export default Header;