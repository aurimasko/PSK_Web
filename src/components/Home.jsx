import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUsers, faTags, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { auth } from "../services/auth.js";


class Home extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				<h1 className="center margin-top-16">Pagrindinis meniu</h1>
				
				<div className="wide width-container">
					
					
					<div className="grid gaps">
						<Link className="button" to="/calendar">
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faCalendarAlt} size="4x" />
							</div>
							Kalendorius
						</Link>
						
						<Link className="button" to="/topics">
						<div className="w100 margin-vertical-16">
							<FontAwesomeIcon icon={faClipboardList} size="4x" />
						</div>
							Temos
						</Link>

						<Link className="button" to={"/user/" + auth.user.id + "/team"}>
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faUsers} size="4x" />
							</div>
							Mano komanda
						</Link>
						
						<Link className="button" to="/roles">
							<div className="w100 margin-vertical-16">
								<FontAwesomeIcon icon={faTags} size="4x" />
							</div>
							Rolės
						</Link>
					</div>
				</div>
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default Home;