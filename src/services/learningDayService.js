import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import moment from 'moment';

export const learningDayService = {

	async fetchLearningDaysByUserIdWithPeriod(userId, startDate, endDate) {
		var startDateDate = moment(startDate).format("YYYY-MM-DD");
		var endDateDate = moment(endDate).format("YYYY-MM-DD");
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint + "?usersIds=" + userId + "&startDate=" + startDateDate + "&endDate=" + endDateDate,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	}
}