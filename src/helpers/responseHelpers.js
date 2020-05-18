export const responseHelpers = {
	convertErrorArrayToString(data) {
		if (data.errorMessages.length === 0) {
			if (data.errorCodes.indexOf("ConcurrencyException") !== -1) {
				//Add proper message for concurrency error
				data.errorMessages.push("Entity has already been changed.");
			//When no error is returned, show generic message
			} else {
				data.errorMessages.push("An error has occurred.");
			}
		}

		return data.errorMessages.join(" <br/> ");
	}
}