import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGraduationCap } from '@fortawesome/free-solid-svg-icons'


class DayContentSidebar extends React.Component {
	
	render() {
		return (
			<>
				
				{this.props.handleUserClose !== undefined ?
					<>
						<div className="flex-right">
							
							<button className="small-btn-noborder" onClick={this.props.handleUserClose}>
								<FontAwesomeIcon icon={faArrowLeft} />
							</button>
							
							<h2 className="margin-bottom-16">FName Lname:</h2>
							
						</div>
						
						<hr />
					</> :
					<></>
				}
					
				<h3>Learning day topics:</h3>
				
				<ul className="fa-ul margin-top-16 scroll">
					<li className="margin-top-8 margin-right-24">
						<Link className="bold" to="/topic/1">
							<FontAwesomeIcon icon={faGraduationCap} listItem />
						React.js portals
					</Link>
						<p>
							Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
					</p>
					</li>
					
					<li className="margin-top-8 margin-right-24">
						<Link className="bold" to="/topic/2"><FontAwesomeIcon icon={faGraduationCap} listItem />Docker</Link>
						<p>
							Docker is a set of platform as a service (PaaS) products that uses OS-level virtualization to deliver software in packages called containers.
					</p>
					</li>
					
					<li className="margin-top-8 margin-right-24">
						<Link className="bold" to="/topic/3"><FontAwesomeIcon icon={faGraduationCap} listItem />CSS grid</Link>
						<p>
							CSS grid layout or CSS grid is a technique in Cascading Style Sheets that allows web developers to create complex responsive web design layouts more easily and consistently across browsers.
					</p>
					</li>
				</ul>
				
				<h3 className="margin-top-16">Learning day comment:</h3>
				
				<p className="">
					<i>no comments</i>
				</p>
					
				<div className="flex-spacer" />
			</>
		);
	}
	
	
}

export default DayContentSidebar;