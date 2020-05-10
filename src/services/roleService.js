import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"

export const roleService = {
	async fetchRole(roleId) {

		return await fetch(
			endPoints.rolesAPIBaseEndPoint + "?id=" + roleId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	},
	async fetchRoles() {
		return await fetch(
			endPoints.rolesAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	}
}