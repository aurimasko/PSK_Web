import React from 'react';
import "../global.css";
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";

class Footer extends React.Component {
	
	render() {
		return (
			<footer>
				<Link className="" to="/about">{languageService.translate("Footer.About")}</Link>
				<Link className="" to="/help">{languageService.translate("Footer.Help")}</Link>
			</footer>
		);
	}
}

export default Footer;