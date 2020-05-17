import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"

export const topicChangesService = {
	async fetchTopicChangesForTopic(topicId) {

		return await fetch(
			endPoints.topicChangesAPIBaseEndPoint + "?topicId=" + topicId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	}
}