import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"
import { languageService } from "../services/languageService.js";

export const objectiveChangeService = {
	async fetchObjectiveChangesForObjective(objectiveId) {

		return await fetch(
			endPoints.objectiveChangesAPIBaseEndPoint + "?objectiveId=" + objectiveId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				}),
			}
		).then(response => { return response.json(); });
	}
}