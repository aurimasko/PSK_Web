import React from 'react';

import Header from "./Header";
import Footer from "./Footer";

import "../global.css";



class Layout extends React.Component {
	
	render() {
		return (
			<>
				<Header noScroll={this.props.noScroll} />
				
				<div className={this.props.noScroll ? "no-scroll flex-spacer flex-down header-margin" : "flex-spacer flex-down header-margin"}>
					{this.props.children}
				</div>
				
				<Footer />
			</>
		);
	}
}

export default Layout;