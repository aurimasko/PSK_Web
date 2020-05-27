export const responseHelpers = {
	convertErrorArrayToString(data) {

		let errorMessages = data.errorMessages || data.ErrorMessages;
		let errorCodes = data.errorCodes || data.ErrorCodes;

		//to avoid errors
		if (!errorMessages)
			errorMessages = [];

		if (!errorCodes)
			errorCodes = [];

		if (errorMessages.length === 0) {
			if (errorCodes.indexOf("ConcurrencyException") !== -1) {
				//Add proper message for concurrency error
				errorMessages.push("Entity has already been changed.");
			//When no error is returned, show generic message
			} else {
				errorMessages.push("An error has occurred.");
			}
		}

		return errorMessages.join(" <br/> ");
	}
}