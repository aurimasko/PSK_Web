import endPoints from "../endPoints.js"
import { auth } from "../services/auth.js"

export const topicService = {
	async fetchTopics() {

		return await fetch(
			endPoints.topicAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	},
	async fetchTopic(id) {
		return await fetch(
			endPoints.topicAPIBaseEndPoint + "?topicsId=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	}
}