import React from 'react';
import Layout from "./Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


class AccessDenied extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				<div className="container">
					<h1 className="center margin-top-8">
						<FontAwesomeIcon icon={faBan} size="4x" />
					</h1>
					<h1 className="center margin-top-8">Access denied</h1>
					
					<p className="mw-120 margin-8 margin-top-16">
						Oops! Looks like you tried to do something that you don't have sufficient permissions for.
						Try clicking the back button or go back to the <Link className="bold" to="/">start screen</Link>.
					</p>
					
				</div>
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default AccessDenied;