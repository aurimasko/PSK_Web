import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"

export const objectiveService = {
	async fetchObjectivesByUserId(id) {
		return await fetch(
			endPoints.objectiveAPIBaseEndPoint + "?objectiveHaverId=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	},
	async updateObjective(objective) {
		return await fetch(
			endPoints.objectiveAPIBaseEndPoint,
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(objective)
			}
		).then(response => { return response.json(); });
	},
}