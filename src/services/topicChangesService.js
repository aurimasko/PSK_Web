import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"
import { languageService } from "../services/languageService.js";

export const topicChangesService = {
	async fetchTopicChangesForTopic(topicId) {

		return await fetch(
			endPoints.topicChangesAPIBaseEndPoint + "?topicId=" + topicId,
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