import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"

export const teamService = {
	async fetchCurrentUserTeam() {

		return await fetch(
			endPoints.teamAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchTeamByLeaderId(id) {

		return await fetch(
			endPoints.teamAPIBaseEndPoint + "?leaderId=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	}
}