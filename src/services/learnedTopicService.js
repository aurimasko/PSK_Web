import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';
import { languageService } from "../services/languageService.js";

export const learnedTopicService = {

	async fetchLearnedTopic(topicId) {
		return await fetch(
			endPoints.learnedTopicAPIBaseEndPoint + "?topic=" + topicId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async learnTopic(date, topicId) {
		var dateDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
		return await fetch(
			endPoints.learnedTopicAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						learnedDate: dateDate,
						topicId: topicId
					}
				)
			}
		).then(response => { return response.json(); });
	},
	async unlearnTopic(topicId) {
		return await fetch(
			endPoints.learnedTopicAPIBaseEndPoint + "?id=" + topicId,
			{
				method: 'delete',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	}
}