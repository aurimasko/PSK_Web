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
	}
}