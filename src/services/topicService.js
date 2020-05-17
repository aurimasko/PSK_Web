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
	},
	async fetchTopicByIds(ids) {
		let q = "?";
		for (let i = 0; i < ids.length; i++) {
			q += "topicsId=" + ids[i];
			if (i !== ids.length - 1)
				q += "&";
		}

		return await fetch(
			endPoints.topicAPIBaseEndPoint + q,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				}),
			}
		).then(response => { return response.json(); });
	},
	async createTopic(name, references, parentId) {
		return await fetch(
			endPoints.topicAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(
					{
						name: name,
						references: references,
						parentId: parentId
					}
				)
			}
		).then(response => { return response.json(); });
	},
	async updateTopic(topic) {
		return await fetch(
			endPoints.topicAPIBaseEndPoint,
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(topic)
			}
		).then(response => { return response.json(); });
	}
}