import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import AuthRoute from "./components/AuthRoute";
import User from "./components/User/User";
import Team from "./components/Team";
import CalendarUserView from "./components/Calendar/CalendarUserView";
import CalendarTeamView from "./components/Calendar/CalendarTeamView";
import Role from "./components/Role";
import RolesList from "./components/RolesList";
import Topic from "./components/Topic";
import TopicsView from "./components/Topics/TopicsView";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AccessDenied from "./components/AccessDenied";
import AddTeamMember from "./components/AddTeamMember";
import EditUser from "./components/User/EditUser";
import ChangePassword from "./components/ChangePassword";
import ChangeRole from "./components/ChangeRole";
import AddTopic from "./components/AddTopic";
import EditTopic from "./components/EditTopic";
import Objectives from "./components/Objectives";
import AddObjective from "./components/AddObjective";
import ChangeSuperVisor from "./components/ChangeSuperVisor";
import ChangeLearningDayLimit from "./components/ChangeLearningDayLimit";
import ChangeTeamLearningDayLimit from "./components/Team/ChangeTeamLearningDayLimit";
import AddTeamObjective from "./components/Team/AddTeamObjective";
import TeamLearningPlan from "./components/Topics/TeamLearningPlan";
import UserLearningPlan from "./components/Topics/UserLearningPlan";
import WhoLearnedTopicTeams from "./components/WhoLearnedTopicTeams";
import WhoLearnedTopicTeamMembers from "./components/WhoLearnedTopicTeamMembers";
import About from "./components/About";
import Help from "./components/Help";
import UserLearningPath from "./components/LearningPath/UserLearningPath";
import TeamLearningPath from "./components/LearningPath/TeamLearningPath";


function App() {
	return (
		<Router>
			<Switch>
				<AuthRoute path="/user/:id/team/wholearnedtopicteams" component={WhoLearnedTopicTeams} />
				<AuthRoute path="/user/:id/wholearnedtopicteammembers" component={WhoLearnedTopicTeamMembers} />
				
				<AuthRoute path="/user/:id/calendar" component={CalendarUserView} />
				<AuthRoute path="/user/:id/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/objectives/add" component={AddObjective} />
				<AuthRoute path="/user/:id/objectives" component={Objectives} />
				<AuthRoute path="/user/:id/learningpath" component={UserLearningPath} />
				<AuthRoute path="/user/:id/learningplan" component={UserLearningPlan} />
				<AuthRoute path="/user/:id/team/calendar" component={CalendarTeamView} />
				<AuthRoute path="/user/:id/team/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/team/add" component={AddTeamMember} />
				<AuthRoute path="/user/:id/team/changelimit" component={ChangeTeamLearningDayLimit} />
				<AuthRoute path="/user/:id/team/addobjective" component={AddTeamObjective} />
				<AuthRoute path="/user/:id/team/learningpath" component={TeamLearningPath} />
				<AuthRoute path="/user/:id/team/learningplan" component={TeamLearningPlan} />
				<AuthRoute path="/user/:id/team" component={Team} />
				<AuthRoute path="/user/:id/edit" component={EditUser} />
				<AuthRoute path="/user/:id/changerole" component={ChangeRole} />
				<AuthRoute path="/user/:id/changesupervisor" component={ChangeSuperVisor} />
				<AuthRoute path="/user/:id/changelearningdaylimit" component={ChangeLearningDayLimit} />
				<AuthRoute path="/user/me/changepassword" component={ChangePassword} />
				<AuthRoute path="/user/:id" component={User} />
				<AuthRoute path="/roles" component={RolesList} />
				<AuthRoute path="/role/:id" component={Role} />
				<AuthRoute path="/topics" component={TopicsView} />
				<AuthRoute path="/topic/add" component={AddTopic} />
				<AuthRoute path="/topic/:id/edit" component={EditTopic} />
				<AuthRoute path="/topic/:id" component={Topic} />
				<AuthRoute path="/about" component={About} />
				<AuthRoute path="/help" component={Help} />
				
				<AuthRoute exact path="/denied" component={AccessDenied} />
				
				<Route path="/login" component={Login} />
				
				<Route exact path="/">
					<Redirect to={"/user/me/calendar"} />
				</Route>
				<AuthRoute path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
