import React from 'react';
import "../global.css";
import { Link } from "react-router-dom";


class Header extends React.Component {
	
	render() {
		return (
			<header>
				<Link className="primary" to="/home">PSK_Web</Link>
				<div className="flex-spacer"></div>
				<Link className="primary" to="/topics">Temos</Link>
				<Link className="primary" to="/login">Atsijungti</Link>
			</header>
		);
	}
}

export default Header;