import React from 'react';
import "../global.css";
import { Link } from "react-router-dom";


class Footer extends React.Component {
	
	render() {
		return (
			<footer>
				<Link className="" to="/about">About</Link>
				<Link className="" to="/help">Support</Link>
			</footer>
		);
	}
}

export default Footer;