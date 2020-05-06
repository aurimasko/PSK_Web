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
				}),
			}
		).then(response => { return response.json(); });
	}
}