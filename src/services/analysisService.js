import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';
import { languageService } from "../services/languageService.js";

export const analysisService = {

	async fetchLearnedTopicUser(topicId) {
		return await fetch(
			endPoints.analysisAPIBaseEndPoint + "/LearningTopic/" + topicId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	}
}