export const responseHelpers = {
	convertErrorArrayToString(data) {
		if (data.errorMessages.length === 0) {
			if (data.errorCodes.indexOf("ConcurrencyException") !== -1) {
				//Add proper message for concurrency error
				data.errorMessages.push("Entity has already been changed.");
			}
		}

		return data.errorMessages.join(" <br/> ");
	}
}