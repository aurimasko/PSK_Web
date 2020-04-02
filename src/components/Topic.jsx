import React from 'react';
import Layout from "./Layout";


class Topic extends React.Component {
	
	render() {
		return (
			<Layout>
				<>
					This is topic<b>#{this.props.match.params.id}</b>
				</>
			</Layout>
		);
	}
}

export default Topic;