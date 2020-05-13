import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


class UserListSidebar extends React.Component {
	
	render() {
		return (
			<>
				
				<div>
					<h3 className="margin-top-24">Teammates:</h3>

					<ul className="fa-ul">
						<li key={1}> {/*1 in this case is ID*/}
							<a href="#" onClick={(e) => {this.props.handleSelectUser(1); e.preventDefault();}}>
								<FontAwesomeIcon icon={faUser} listItem />
								Aaa Bbb
							</a>
						</li>
						<li key={2}>
							<a href="#" onClick={(e) => {this.props.handleSelectUser(2); e.preventDefault();}}>
								<FontAwesomeIcon icon={faUser} listItem />
								Ccc Ddd
							</a>
						</li>
					</ul>
				</div>
				
				<div className="flex-spacer" />
			</>
		);
	}
	
	
}

export default UserListSidebar;