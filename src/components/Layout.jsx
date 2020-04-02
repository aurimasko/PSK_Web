import React from 'react';

import Header from "./Header";
import Footer from "./Footer";

import "../global.css";



class Layout extends React.Component {
	
	render() {
		return (
			<>
				<Header />
				
				<div className="flex-spacer flex-down header-margin">
					{this.props.children}
				</div>
				
				<Footer />
			</>
		);
	}
}

export default Layout;