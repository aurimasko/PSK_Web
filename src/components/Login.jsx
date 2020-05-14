import React from 'react';
import { auth } from "../services/auth.js";

import Notifications from "./Notifications";
import Loading from "../components/Loading";

class Login extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			email: "",
			password: "",
			isLoginButtonEnabled: true
		}
		
		this.notifRef = React.createRef();
		
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	renderLoginButton() {
		if (this.state.isLoginButtonEnabled) {
			return <input className="primary" type="submit" value="Login" />;
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
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

						{this.renderLoginButton()}
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

		this.setState({ isLoginButtonEnabled: false });

		auth.login(this.state.email, this.state.password)
			.then((response) => {
				if (response === true) {
					this.props.history.push("/");
				} else {
					if (response === "NotFound") {
						this.notifRef.current.addNotification({ text: "User was not found." });
					} else if (response === "UsernameOrPasswordIsIncorrect") {
						this.notifRef.current.addNotification({ text: "Incorrect password." });
					} else {
						this.notifRef.current.addNotification({ text: response });
					}
				}
				this.setState({ isLoginButtonEnabled: true });
			});
	}
}

export default Login;