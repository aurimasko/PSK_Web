import Cookies from 'js-cookie';
import { userService } from "../services/userService.js";
import endPoints from "../endPoints.js"

export const auth = {
	
	user: null,
	
	async login(email, password) {
		
		let data = new URLSearchParams();
		data.append('grant_type', 'password');
		data.append('client_id', 'WebApp');
		data.append('client_secret', 'ea832211-c145-47ed-9fb6-0d12e9a88192');
		data.append('scope', 'RestAPI');
		data.append('username', email);
		data.append('password', password);
		
		var result = await fetch(
			endPoints.identityAPITokenEndPoint,
			{
				method: 'post',
				body: data
			}
		)
		.then(response => { return response.json(); });

		if (result.error) {
			return result.error_description;
		}

		Cookies.set("session", result);
		Cookies.set("email", email);

		await this.fetchUser();

		return true;
	},
	
	logout() {
		Cookies.remove("session");
		Cookies.remove("email");
		this.user = null;
	},
	
	async fetchUser() {
		await userService.fetchUser()
		.then(data => {
			this.user = data.content[0];
		});
	},
	
	async getUser() {
		
		if (!Cookies.getJSON("session")) {
			return null;
		}
		
		if (!this.user) {
			await this.fetchUser();
		}
			
		return this.user;
	},
	
	async isLoggedIn() {
		return await this.getUser() ? true : false;
	},

	getAccessToken() {
		return Cookies.getJSON("session").access_token;
	},

	getUsername() {
		return Cookies.getJSON("email");
    }
}