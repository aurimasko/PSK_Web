import { auth } from "../services/auth.js"
import endPoints from "../endPoints.js"
import { languageService } from "../services/languageService.js";

export const userService = {

	async fetchUser() {

		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?username=" + auth.getUsername(),
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchUsers() {

		return await fetch(
			endPoints.usersAPIBaseEndPoint,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchUserById(id) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?id=" + id,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async createUser(emailAddress, firstName, lastName) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						username: emailAddress,
						firstName: firstName,
						lastName: lastName
					}
				)
			}
		).then(response => { return response.json(); });
	},
	async fetchUsersByRole(roleId) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint + "?roleId=" + roleId,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async fetchUsersByIds(ids) {
		let q = "?";
		for (let i = 0; i < ids.length; i++) {
			q += "userIds=" + ids[i];
			if (i !== ids.length - 1)
				q += "&";
		}
		return await fetch(
			endPoints.usersAPIBaseEndPoint + q,
			{
				method: 'get',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Accept-Language": languageService.getLanguage()
				})
			}
		).then(response => { return response.json(); });
	},
	async updateUser(user) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint,
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(user)
			}
		).then(response => { return response.json(); });
	},
	async changePassword(currentPassword, newPassword, newPasswordRepeated) {
		return await fetch(
			endPoints.usersAPIBaseEndPoint + "/ChangePassword",
			{
				method: 'put',
				headers: new Headers({
					"Authorization": "Bearer " + auth.getAccessToken(),
					"Content-Type": "application/json-patch+json",
					"Accept-Language": languageService.getLanguage()
				}),
				body: JSON.stringify(
					{
						currentPassword: currentPassword,
						newPassword: newPassword,
						newPasswordRepeated: newPasswordRepeated
					}
				)
			}
		).then(response => { return response.json(); });
    }
}