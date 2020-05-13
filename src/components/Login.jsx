import React from 'react';
import { auth } from "../services/auth.js";

import Notifications from "./Notifications";


class Login extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			email: "",
			password: ""
		}
		
		this.notifRef = React.createRef();
		
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		return (
			<div className="flex-spacer flex-down">
				
				<Notifications ref={this.notifRef} noScroll={true} />
				
				<div className="flex-spacer" />
				<div className="container wide">
					<h1 className="margin-bottom-8">Login</h1>
					
					<form className="flex-down" onSubmit={this.handleSubmit}>
						<label>
							Email address
							<input required type="email" value={this.state.email} onChange={this.handleEmailChange} />
						</label>
						<label>
							Password
							<input required type="password" value={this.state.password} onChange={this.handlePasswordChange} />
						</label>
						
						<hr />
						
						<input className="primary" type="submit" value="Login"/>
					</form>
				</div>
				<div className="flex-spacer" />
			</div>
		);
	}
	
	handleEmailChange(event) {
		this.setState({email: event.target.value});
	}
	
	handlePasswordChange(event) {
		this.setState({password: event.target.value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		
		if (this.state.password.length < 8) {
			this.notifRef.current.addNotification("Example notification");
			return;
		}
		
		auth.login(this.state.email, this.state.password)
		.then(() => {
			this.props.history.push("/");
		});
	}
}

export default Login;