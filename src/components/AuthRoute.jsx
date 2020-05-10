import React from 'react';
import {
	Route,
	Redirect
} from "react-router-dom";
import { auth } from "../services/auth.js";
import Loading from "../components/Loading";


class AuthRoute extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: null,
			user: null
		}
	}
	
	async componentDidMount() {
		
		this.setState({loggedIn: await auth.isLoggedIn()});
		//this.setState({user: await auth.getUser()});
		
		// temporary
		var usr = await auth.getUser();
		if (usr !== null) {
			usr.hasChangedInitalPassword = true;
			this.setState({user: usr});
		}
	}
	
	render() {
		
		if (this.state.loggedIn === null || (this.state.loggedIn && this.state.user === null)) {
			return <Loading showText={true}/>;
		}
		
		if (!this.state.loggedIn) {
			return <Redirect to="/login" />;
		}
		
		if (!this.state.user.hasChangedInitalPassword) {
			return "TODO: password change view";
		}
		
		return <Route component={this.props.component} path={this.props.path}></Route>;
	}
	
}

export default AuthRoute;