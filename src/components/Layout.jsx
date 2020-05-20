import React from 'react';

import Header from "./Header";
import Footer from "./Footer";
import Notifications from "./Notifications";

import "../global.css";



class Layout extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.notifRef = React.createRef();
	}
	
	render() {
		return (
			//<div id="fake-root">
			<>
				<Header noScroll={this.props.noScroll} />
				<Notifications ref={this.notifRef} noScroll={this.props.noScroll} />
				
				<div className={this.props.noScroll ? "no-scroll flex-spacer flex-down" : "flex-spacer flex-down"}>
					{this.props.children}
				</div>
				
				<Footer />
			</>
			//</div>
		);
	}
	
	addNotification(text) {
		this.notifRef.current.addNotification(text);
	}
	
	closeNotification(index) {
		this.notifRef.current.closeNotification(index);
	}
}

export default Layout;