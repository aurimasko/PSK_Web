export const sortHelpers = {
	sortUsersByFirstNameAndLastName(users) {
		//sort by first name
		return users.sort(function (a, b) {
			if (a.firstName < b.firstName) { return -1; }
			if (a.firstName > b.firstName) { return 1; }
			return 0;
			//sort by last name
		}).sort(function (a, b) {
			if (a.lastName < b.lastName) { return -1; }
			if (a.lastName > b.lastName) { return 1; }
			return 0;
		});
	}
}