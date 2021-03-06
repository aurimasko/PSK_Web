const identityAPIEndPoint = "https://confikturaidentity.azurewebsites.net";
const identityAPITokenEndPoint = identityAPIEndPoint + "/connect/token";
const apiBaseEndPoint = "https://confikturaservice.azurewebsites.net";
const usersAPIBaseEndPoint = apiBaseEndPoint + "/Users";
const rolesAPIBaseEndPoint = apiBaseEndPoint + "/Roles";
const teamAPIBaseEndPoint = apiBaseEndPoint + "/Team";
const learningDaysAPIBaseEndPoint = apiBaseEndPoint + "/LearningDays";
const topicAPIBaseEndPoint = apiBaseEndPoint + "/Topics";
const topicChangesAPIBaseEndPoint = apiBaseEndPoint + "/TopicChanges";
const objectiveAPIBaseEndPoint = apiBaseEndPoint + "/Objective";
const objectiveChangesAPIBaseEndPoint = apiBaseEndPoint + "/ObjectiveChange";
const analysisAPIBaseEndPoint = apiBaseEndPoint + "/Analysis";
const learnedTopicAPIBaseEndPoint = apiBaseEndPoint + "/LearnedTopics";

module.exports = {
    identityAPITokenEndPoint: identityAPITokenEndPoint,
    usersAPIBaseEndPoint: usersAPIBaseEndPoint,
    rolesAPIBaseEndPoint: rolesAPIBaseEndPoint,
    teamAPIBaseEndPoint: teamAPIBaseEndPoint,
    learningDaysAPIBaseEndPoint: learningDaysAPIBaseEndPoint,
    topicAPIBaseEndPoint: topicAPIBaseEndPoint,
    topicChangesAPIBaseEndPoint: topicChangesAPIBaseEndPoint,
    objectiveAPIBaseEndPoint: objectiveAPIBaseEndPoint,
    objectiveChangesAPIBaseEndPoint: objectiveChangesAPIBaseEndPoint,
    analysisAPIBaseEndPoint: analysisAPIBaseEndPoint,
    learnedTopicAPIBaseEndPoint: learnedTopicAPIBaseEndPoint
}
