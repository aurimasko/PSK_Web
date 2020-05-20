import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"

export const objectiveChangeService = {
	async fetchObjectiveChangesForObjective(objectiveId) {

		return await fetch(
			endPoints.objectiveChangesAPIBaseEndPoint + "?objectiveId=" + objectiveId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	}
}