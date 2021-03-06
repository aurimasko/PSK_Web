import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';
import { languageService } from "../services/languageService.js";

export const learningDayService = {

	async fetchLearningDaysByUserIdWithPeriod(userId, startDate, endDate) {
		var startDateDate = moment(startDate).format("YYYY-MM-DD");
		var endDateDate = moment(endDate).format("YYYY-MM-DD");
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint + "?usersIds=" + userId + "&dateFrom=" + startDateDate + "&dateTo=" + endDateDate,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},

	async fetchLearningDaysById(id) {
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint + "?learningDaysIds=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async addLearningDay(date, topicIds, comments) {
		var dateDate = moment(date).format("YYYY-MM-DD");
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						date: dateDate,
						comments: comments,
						topicsId: topicIds
					}
				)
			}
		).then(response => { return response.json(); });
	},
	async updateLearningDay(learningDay) {
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint,
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(learningDay)
			}
		).then(response => { return response.json(); });
	}
}