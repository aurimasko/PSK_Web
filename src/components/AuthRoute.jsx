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
			loggedIn: null
		}
	}
	
	componentDidMount() {
		auth.isLoggedIn()
			.then((bool) => this.setState({loggedIn: bool}));
	}
	
	render() {
		
		if (this.state.loggedIn === null) {
			return <Loading/>;
		}

		return (
			this.state.loggedIn === true ? 
				<Route component={this.props.component} path={this.props.path}></Route>:
				<Redirect to="/login" />		
		);
	}
	
}

export default AuthRoute;