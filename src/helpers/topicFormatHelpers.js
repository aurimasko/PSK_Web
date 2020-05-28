export const topicFormatHelpers = {
	
	findTopicChildren(thisTopic, unassignedTopics) {
		for (let i = 0; i < unassignedTopics.length; i++) {
			if (unassignedTopics[i].parentId === thisTopic.id) {
				thisTopic.children.push(unassignedTopics[i]);
				unassignedTopics.splice(i, 1);
				i--;
				break;
			}
		}
		
		if (unassignedTopics.length > 0) {
			thisTopic.children.forEach(child => this.findTopicChildren(child, unassignedTopics));
		}
	},
	
	topicListNester(originalTopicData) {
		
		let origDataCopy = originalTopicData;
		origDataCopy.forEach(topic => topic.children = []);
		
		let formattedContent = origDataCopy.filter(topic => topic.parentId === null)
		let unassignedTopics = origDataCopy.filter(topic => topic.parentId !== null)
		
		for (let badDataGuard = 0; badDataGuard < origDataCopy.length; badDataGuard++) {
			for (let i = 0; i < formattedContent.length; i++) {
				this.findTopicChildren(formattedContent[i], unassignedTopics, 0);
			}
		}
		
		return {
			formattedTopicData: formattedContent,
			unassignedTopicData: unassignedTopics
		};
	}
}