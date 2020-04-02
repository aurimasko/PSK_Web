import React from 'react';
import Layout from "./Layout";


class NotFound extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="flex-spacer" />
				<div className="container">
					<h1 className="extra center">404</h1>
					<h1>Toks puslapis nerastas</h1>
				</div>
				<div className="flex-spacer" />
			</Layout>
		);
	}
}

export default NotFound;