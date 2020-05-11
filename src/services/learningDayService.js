import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"

export const learningDayService = {

	async fetchLearningDaysByUserIdWithPeriod(userId, startDate, endDate) {
		return await fetch(
			endPoints.learningDaysAPIBaseEndPoint + "?usersIds=" + userId + "&startDate=" + startDate + "&endDate=" + endDate,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken()
				})
			}
		).then(response => { return response.json(); });
	}
}