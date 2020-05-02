import Cookies from 'js-cookie';


export const auth = {
	
	user: null,
	
	async login(email, password) {
		console.log("login: " + email + " " + password);
		
		let data = new URLSearchParams();
		data.append('grant_type', 'password');
		data.append('client_id', 'WebApp');
		data.append('client_secret', 'ea832211-c145-47ed-9fb6-0d12e9a88192');
		data.append('scope', 'RestAPI');
		data.append('username', email);
		data.append('password', password);
		
		await fetch(
			"https://confikturaidentity.azurewebsites.net/connect/token",
			{
				method: 'post',
				body: data
			}
		)
		.then(response => response.json())
		.then(data => {
			Cookies.set("session", data);
			Cookies.set("email", email);
		});
		
		await this.fetchUser();
	},
	
	logout() {
		Cookies.remove("session");
		Cookies.remove("email");
		this.user = null;
	},
	
	async fetchUser() {
		
		await fetch(
			"https://confikturaservice.azurewebsites.net/Users?username=" + Cookies.getJSON("email"),
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + Cookies.getJSON("session").access_token
				}),
			}
		)
		.then(response => response.json())
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
}