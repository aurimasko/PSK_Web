export const responseHelpers = {
	convertErrorArrayToString(data) {
		return data.errorMessages.join(" <br/> ");
	}
}