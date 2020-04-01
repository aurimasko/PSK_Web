import React from 'react';


class Topic extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<>This is topic <b>#{this.props.match.params.id}</b></>
		);
	}
}

export default Topic;