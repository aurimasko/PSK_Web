import React from 'react';
import "../global.css";
import { Link } from "react-router-dom";


class Footer extends React.Component {
	
	render() {
		return (
			<footer>
				<Link className="" to="/about">Apie sistemą</Link>
				<Link className="" to="/help">Pagalba</Link>
			</footer>
		);
	}
}

export default Footer;