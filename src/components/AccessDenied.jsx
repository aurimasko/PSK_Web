import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { languageService } from "../services/languageService.js";

class AccessDenied extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				<div className="container">
					<h1 className="center margin-top-8">
						<FontAwesomeIcon icon={faBan} size="4x" />
					</h1>
					<h1 className="center margin-top-8">{languageService.translate("AccessDenied.Title")}</h1>
					
					<p className="mw-120 margin-8 margin-top-16">
						{languageService.translate("AccessDenied.Message")}<Link className="bold" to="/">{languageService.translate("AccessDenied.Link")}</Link>.
					</p>
					
				</div>
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default AccessDenied;