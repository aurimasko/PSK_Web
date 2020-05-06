const identityAPIEndPoint = "https://confikturaidentity.azurewebsites.net";
const identityAPITokenEndPoint = identityAPIEndPoint + "/connect/token";
const apiBaseEndPoint = "https://confikturaservice.azurewebsites.net";
const usersAPIBaseEndPoint = apiBaseEndPoint + "/Users";
const rolesAPIBaseEndPoint = apiBaseEndPoint + "/Roles";
const teamAPIBaseEndPoint = apiBaseEndPoint + "/Team";

module.exports = {
    identityAPITokenEndPoint: identityAPITokenEndPoint,
    usersAPIBaseEndPoint: usersAPIBaseEndPoint,
    rolesAPIBaseEndPoint: rolesAPIBaseEndPoint,
    teamAPIBaseEndPoint: teamAPIBaseEndPoint
}