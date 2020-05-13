import React from 'react';


class DayContentSidebar extends React.Component {
	
	render() {
		return (
			<>
				<div className="flex-spacer" />
				
				<span className="center margin-left-16 margin-right-16">
					There are no registered learning days on this date.
				</span>
				
				<div className="flex-spacer" />
			</>
		);
	}
	
	
}

export default DayContentSidebar;