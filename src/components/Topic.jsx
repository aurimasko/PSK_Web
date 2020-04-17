import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";


class Topic extends React.Component {
	
	render() {
		return (
			<Layout>
				<div className="container wide">
					
					<h1>Temos pavadinimas ({this.props.match.params.id})</h1>
					<h4>
						Tėvinė tema: <Link className="" to="/topic/1">■■■■</Link>
					</h4>
					
					<p className="margin-top-16">
						 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pellentesque odio id tellus tempor suscipit. Morbi in maximus libero, vel consectetur justo. Nunc ac faucibus metus. Sed in finibus ex. Nam aliquam mauris rhoncus turpis accumsan, vel pulvinar ante auctor. Donec ut sagittis nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque non neque nibh. Morbi a felis quis elit semper auctor et nec turpis. In hac habitasse platea dictumst. Nulla vel blandit ex. Nulla sit amet ipsum rutrum, sodales turpis et, viverra nunc. In sed enim massa. Curabitur non semper libero, at vehicula sapien.
					</p>
					
				</div>
			</Layout>
		);
	}
}

export default Topic;