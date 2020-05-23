import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';
import { languageService } from "../services/languageService.js";

export const teamService = {
	async fetchCurrentUserTeam() {

		return await fetch(
			endPoints.teamAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchTeamByLeaderId(id) {

		return await fetch(
			endPoints.teamAPIBaseEndPoint + "?superVisorId=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchLearningDaysByLeaderId(id, startDate, endDate) {
		var startDateDate = moment(startDate).format("YYYY-MM-DD");
		var endDateDate = moment(endDate).format("YYYY-MM-DD");
		return await fetch(
			endPoints.teamAPIBaseEndPoint + "/LearningDays?superVisorId=" + id + "&dateFrom=" + startDateDate + "&dateTo=" + endDateDate,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async changeTeamLearningDayLimit(newLimit) {
		return await fetch(
			endPoints.teamAPIBaseEndPoint + "/LimitChange?newLimit=" + newLimit,
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async createTeamObjective(topicId, deadline, roleId) {

		let query = "";

		if (roleId)
			query = "?roleId=" + roleId;

		return await fetch(
			endPoints.teamAPIBaseEndPoint + "/Objective" + query,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						topicId: topicId,
						deadline: deadline
					}
				)
			}
		).then(response => { return response.json(); });
	}
}