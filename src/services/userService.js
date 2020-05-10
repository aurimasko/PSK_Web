import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"

export const userService = {

	async fetchUser() {

		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?username=" + auth.getUsername(),
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchUserById(id) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?id=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	},
	async createUser(emailAddress, firstName, lastName) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(
					{
						username: emailAddress,
						firstName: firstName,
						lastName: lastName
					}
				)
			}
		).then(response => { return response.json(); });
	},
	async fetchUsersByRole(roleId) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?roleId=" + roleId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
    }
}