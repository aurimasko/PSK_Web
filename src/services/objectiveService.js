import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"
import { languageService } from "../services/languageService.js";

export const objectiveService = {
	async fetchObjectivesByUserId(id) {
		return await fetch(
			endPoints.objectiveAPIBaseEndPoint + "?objectiveHaverId=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
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
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(objective)
			}
		).then(response => { return response.json(); });
	},
	async createObjective(objectiveHaverId, topicId, deadline) {
		return await fetch(
			endPoints.objectiveAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						objectiveHaverId: objectiveHaverId,
						topicId: topicId,
						deadline: deadline
					}
				)
			}
		).then(response => { return response.json(); });
	}
}