import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';

export const teamService = {
	async fetchCurrentUserTeam() {

		return await fetch(
			endPoints.teamAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
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
					"Authorization": "Bearer " + auth.getAccessToken()
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
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	}
}